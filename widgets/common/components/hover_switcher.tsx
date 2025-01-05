import { Widget, Gtk } from "astal/gtk3"
import { Binding, bind, Variable } from "astal"

const { RevealerTransitionType: Transition } = Gtk

export interface HoverSwitcherProps extends Widget.BoxProps {
  transitionType?: Gtk.RevealerTransitionType;
  transitionDuration?: number | Binding<number>;
}

const invertTransitionType = (transitionType: Gtk.RevealerTransitionType) => {
  return  {
    [Transition.SLIDE_LEFT]: Transition.SLIDE_RIGHT,
    [Transition.SLIDE_RIGHT]: Transition.SLIDE_LEFT,
    [Transition.SLIDE_UP]: Transition.SLIDE_DOWN,
    [Transition.SLIDE_DOWN]: Transition.SLIDE_UP,
  }[transitionType] ?? transitionType
}

const HoverSwitcher = (
  { transitionType = Transition.SLIDE_LEFT, transitionDuration = 500,
    children, ...props
  }: HoverSwitcherProps) => {
  children = children as [Gtk.Widget, Gtk.Widget]
  if (children === undefined)
    throw new Error("HoverSwitcher needs two children, the displayed widget and the revealed one")

  const hovered = Variable(false)

  const revealer = <revealer
    revealChild={bind(hovered)}
    transitionType={transitionType}
    transitionDuration={transitionDuration}>
    {children[1]}
  </revealer>

  const displayer = <revealer
    revealChild={bind(hovered).as(v => !v)}
    transitionType={invertTransitionType(transitionType)}
    transitionDuration={transitionDuration}>
    {children[0]}
  </revealer>

  return <eventbox
    onHover={() => hovered.set(true)}
    onHoverLost={() => hovered.set(false)}
    onDestroy={() => hovered.drop()}>
    <box
      {...props}
      vertical={props.vertical ?? /SLIDE_(UP|DOWN)/.test(transitionType.toString())}>
      {/SLIDE_(RIGHT|DOWN)/.test(transitionType.toString())
        ? [revealer, displayer]
        : [displayer, revealer]}
    </box>
  </eventbox>
}

export default HoverSwitcher