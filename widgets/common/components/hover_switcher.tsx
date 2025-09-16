import Gtk from "gi://Gtk";
import { Accessor, createState, CCProps } from "gnim";

const { RevealerTransitionType: Transition } = Gtk

export interface HoverSwitcherProps extends CCProps<Gtk.Box, Gtk.Box.ConstructorProps> {
  transitionType?: Gtk.RevealerTransitionType;
  transitionDuration?: number | Accessor<number>;
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
    orientation, children, $, onDestroy, ...props
  }: HoverSwitcherProps) => {
  children = children as [Gtk.Widget, Gtk.Widget]
  if (children === undefined)
    throw new Error("HoverSwitcher needs two children, the displayed widget and the revealed one")

  const [hovered, setHovered] = createState(false)

  const revealer = <revealer
    revealChild={hovered}
    transitionType={transitionType}
    transitionDuration={transitionDuration}>
    {children[1]}
  </revealer>

  const displayer = <revealer
    revealChild={hovered.as(v => !v)}
    transitionType={invertTransitionType(transitionType)}
    transitionDuration={transitionDuration}>
    {children[0]}
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
    {/SLIDE_(RIGHT|DOWN)/.test(transitionType.toString())
      ? [revealer, displayer]
      : [displayer, revealer]}
  </box>
}

export default HoverSwitcher