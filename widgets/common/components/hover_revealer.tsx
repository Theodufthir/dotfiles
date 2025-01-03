import { Gtk, Widget } from "astal/gtk3"
import { Binding, Variable, bind } from "astal"

const { RevealerTransitionType: Transition } = Gtk

export interface HoverRevealerProps extends Widget.BoxProps {
  transitionType?: Gtk.RevealerTransitionType;
  transitionDuration?: number | Binding<number>;
  lockReveal?: boolean | null | Binding<boolean | null>;
}

const HoverRevealer = (
  {
    transitionType = Transition.SLIDE_LEFT, transitionDuration = 500,
    children, lockReveal = null, ...props
  }: HoverRevealerProps) => {
  children = children as [Gtk.Widget, Gtk.Widget]
  if (children === undefined)
    throw new Error("HoverRevealer needs two children, the displayed widget and the revealed one")

  const hovered = Variable(false)

  if (lockReveal === null || typeof lockReveal === "boolean") {
    const lockRevealVar = Variable(lockReveal)
    hovered.onDropped(lockRevealVar.drop)
    lockReveal = bind(lockRevealVar)
  }

  const reveal = Variable.derive([bind(hovered), lockReveal], (hov, lock) => lock ?? hov)
  reveal.onDropped(hovered.drop)

  const revealer = <revealer
    revealChild={bind(reveal)}
    transitionType={transitionType}
    transitionDuration={transitionDuration}>
    {children[1]}
  </revealer>

  return <eventbox
    onHover={() => hovered.set(true)}
    onHoverLost={() => hovered.set(false)}
    onDestroy={reveal.drop}>
    <box
      {...props}
      vertical={props.vertical ?? (transitionType === Transition.SLIDE_UP || transitionType === Transition.SLIDE_DOWN)}>
      {(transitionType === Transition.SLIDE_RIGHT || transitionType === Transition.SLIDE_DOWN)
        ? [revealer, children[0]]
        : [children[0], revealer]}
    </box>
  </eventbox>
}


export default HoverRevealer