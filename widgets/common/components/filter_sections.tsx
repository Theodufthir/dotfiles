import Gtk from "gi://Gtk";
import { CCProps, Accessor } from "gnim";
import { Object as GObject } from "gnim/gobject";
import { createMultiBinding } from "../../../utils/variables";

export interface Section<T> {
  filter: (data: T) => boolean;
  adds?: GObject[];
  hideIfEmpty?: boolean;
  props?: Partial<CCProps<Gtk.Box, Gtk.Box.ConstructorProps>>;
}

export interface FilteredSectionsProps<T, S> extends Partial<CCProps<Gtk.Box, Gtk.Box.ConstructorProps>> {
  source: Accessor<T[]>;
  triggers: S;
  template: (data: T) => GObject;
  sections: (Section<T> | GObject)[];
}

function FilteredSections<T extends GObject, S extends (keyof T)[]>(
  { source, triggers, template, sections, ...props }: FilteredSectionsProps<T, S>,
) {
  const sectionsMap: Map<Gtk.Box, Section<T>> = new Map
  const cleanupMap: Map<T, () => void> = new Map

  const children = sections.map(child => {
    // @ts-ignore
    if (child instanceof GObject) {
      return child
    } else {
      const section = child as Section<T>
      let widget: Gtk.Box
      const box = <box
        $={self => {
          widget = self
          section.props?.$?.call(self, self)
        }}
        {...section.props}>
        {section.adds}
      </box>
      sectionsMap.set(widget!, section)
      return widget!
    }
  }) as Gtk.Widget[]

  const sectionsList = [...sectionsMap.entries()].map(([container, section]) => ({ container, section }))
  const findMatchingSection = (obj: T) => sectionsList.find(({ section }) => section.filter(obj))?.container
  const computeContainerVisibility = (container?: Gtk.Box | null) => {
    if (container === null) return
    const toCompute = container === undefined ? sectionsList : [{ container, section: sectionsMap.get(container)! }]
    for (const { section, container } of toCompute.filter(({ section }) => section.hideIfEmpty))
      container.set_visible(container.get_last_child() != (section.adds?.[section.adds?.length - 1]))
  }

  const handleObjs = (objs: T[]) => {
    const toCleanup = new Set(cleanupMap.keys())
    objs.forEach(obj => {
      if (!cleanupMap.has(obj)) {
        const trigger = createMultiBinding(obj, triggers, () => obj)
        let widget: Gtk.Widget
        const gobject = <box $={self => widget = self}>{template(obj)}</box>
        findMatchingSection(obj)?.append(widget!)
        const unsubscribe = trigger.subscribe(() => {
          const objNow = trigger.get()
          const newParent = findMatchingSection(objNow) ?? null
          const oldParent = widget.parent as Gtk.Box
          if (oldParent === newParent) return

          widget.unparent()
          if (newParent !== null) widget.set_parent(newParent)

          computeContainerVisibility(oldParent)
          computeContainerVisibility(newParent)
        })
        cleanupMap.set(obj, () => {
          unsubscribe()
          widget.run_dispose()
          cleanupMap.delete(obj)
        })
      } else {
        toCleanup.delete(obj)
      }
    })
    for (const obj of toCleanup)
      cleanupMap.get(obj)!()
    computeContainerVisibility()
  }

  handleObjs(source.get())
  const unsubscribe = source.subscribe(() => handleObjs(source.get()))

  return <box
    {...props}
    children={children}
    onDestroy={(self) => {
      if (props.onDestroy !== undefined) props.onDestroy(self)
      for (const cleanup of cleanupMap.values()) cleanup()
      unsubscribe()
    }}
  />
}


export {
  FilteredSections
}