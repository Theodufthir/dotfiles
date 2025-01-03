import { Binding } from "astal"
import { nTrigger } from "../../../utils/variables";
import { Connectable } from "astal/binding"
import { Widget, Gtk } from "astal/gtk3"

export interface Section<T> {
  filter: (data: T) => boolean;
  adds?: Gtk.Widget[];
  hideIfEmpty?: boolean;
  props?: Widget.BoxProps;
}

export interface FilteredSectionsProps<T, S> extends Widget.BoxProps {
  source: Binding<T[]>;
  triggers: S;
  template: (data: T) => Gtk.Widget;
  sections: (Section<T> | Gtk.Widget)[];
}

function FilteredSections<T extends Connectable, S extends (keyof T)[]>(
  { source, triggers, template, sections, ...props }: FilteredSectionsProps<T, S>,
) {
  const sectionsMap: { section: Section<T>, container: Gtk.Container }[] = []
  const cleanupMap: Map<T, () => void> = new Map

  const children = sections.map(child => {
    // @ts-ignore
    if (typeof child["filter"] !== "function") {
      return child
    } else {
      const section = child as Section<T>
      const widget = <box {...section.props}>{section.adds}</box>
      sectionsMap.push({ section, container: (widget as Gtk.Container) })
      return widget
    }
  }) as Gtk.Widget[]

  const findMatchingSection = (obj: T) => sectionsMap.find(s => s.section.filter(obj))?.container

  const handleObjs = (objs: T[]) => {
    const toCleanup = new Set(cleanupMap.keys())
    objs.forEach(obj => {
      if (!cleanupMap.has(obj)) {
        const trigger = nTrigger(obj, triggers)
        const widget = template(obj)
        findMatchingSection(obj)?.add(widget)
        trigger.subscribe(objNow => {
          const container = findMatchingSection(objNow)
          if (container !== undefined)
            widget.reparent(container)
          else
            widget.unparent()
        })
        cleanupMap.set(obj, () => {
          try { trigger.drop() } catch (e) {}
          widget.destroy()
          cleanupMap.delete(obj)
        })
      } else {
        toCleanup.delete(obj)
      }
    })
    for (const obj of toCleanup)
      cleanupMap.get(obj)!()
    for (const { section, container } of sectionsMap.values()) {
      if (section.hideIfEmpty)
        container.set_visible(container.get_children().length > (section.adds?.length ?? 0))
    }
  }

  handleObjs(source.get())
  const unsubscribe = source.subscribe(handleObjs)

  return <box {...props} onDestroy={(self) => {
    if (props.onDestroy !== undefined) props.onDestroy(self)
    for (const cleanup of cleanupMap.values()) cleanup()
    unsubscribe()
  }}>
    {children}
  </box>
}


export {
  FilteredSections
}