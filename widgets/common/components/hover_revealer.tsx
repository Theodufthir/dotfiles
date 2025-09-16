import Gtk from "gi://Gtk";
import { Accessor, createState, createComputed, CCProps } from "gnim";

const { RevealerTransitionType: Transition } = Gtk

export interface HoverRevealerProps extends Partial<CCProps<Gtk.Box, Gtk.Box.ConstructorProps>> {
  transitionType?: Gtk.RevealerTransitionType;
  transitionDuration?: number | Accessor<number>;
  lockReveal?: boolean | null | Accessor<boolean | null>;
}

const HoverRevealer = (
  {
    transitionType = Transition.SLIDE_LEFT, transitionDuration = 500, lockReveal = null,
    orientation, children, $, onDestroy, ...props
  }: HoverRevealerProps) => {
  children = children as [Gtk.Widget, Gtk.Widget]
  if (children === undefined)
    throw new Error("HoverRevealer needs two children, the displayed widget and the revealed one")

  const [hovered, setHovered] = createState(false)

  if (lockReveal === null || typeof lockReveal === "boolean") {
    const [lockRevealState, _] = createState(lockReveal)
    lockReveal = lockRevealState
  }

  const reveal = createComputed((get) => get(lockReveal) ?? get(hovered))

  const revealer = <revealer
    revealChild={reveal}
    transitionType={transitionType}
    transitionDuration={transitionDuration}>
    {children[1]}
  </revealer>

  const motionHandler = new Gtk.EventControllerMotion()

  const enterId = motionHandler.connect("enter", () => setHovered(true))
  const leaveId = motionHandler.connect("leave", () => setHovered(false))

  return <box
    $={self => {
      self.add_controller(motionHandler)
      $?.call(self, self)
    }}
    onDestroy={self => {
      motionHandler.disconnect(enterId)
      motionHandler.disconnect(leaveId)
      onDestroy?.call(self, self)
    }}
    orientation={orientation ?? (transitionType === Transition.SLIDE_UP || transitionType === Transition.SLIDE_DOWN) ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}
    {...props}>
    {(transitionType === Transition.SLIDE_RIGHT || transitionType === Transition.SLIDE_DOWN)
      ? [revealer, children[0]]
      : [children[0], revealer]}
    </box>
}


export default HoverRevealer