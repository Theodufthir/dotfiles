import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";
import { CCProps } from "gnim";

export type ClickHandler = (self: Gtk.GestureClick, event: Gdk.ButtonEvent | null, consecutive: number) => any

export interface ButtonProps extends Partial<CCProps<Gtk.Button, Gtk.Button.ConstructorProps>> {
  onPrimaryClick?: ClickHandler;
  onSecondaryClick?: ClickHandler;
  onMiddleClick?: ClickHandler;
}

const Button = ({
  onPrimaryClick, onSecondaryClick, onMiddleClick,
  $, onDestroy, ...props
}: ButtonProps) => {
  const clickHandler = new Gtk.GestureClick({
    button: 0,
    propagation_phase: Gtk.PropagationPhase.BUBBLE
  })

  const connectionId = clickHandler.connect("pressed", (self, consecutive) => [
    undefined,
    onPrimaryClick,
    onMiddleClick,
    onSecondaryClick
  ][self.get_current_button()]?.(
    self,
    self.get_current_event() as Gdk.ButtonEvent,
    consecutive
  ))

  return <button
    $={self => {
      self.add_controller(clickHandler)
      $?.call(self, self)
    }}
    onDestroy={self => {
      clickHandler.disconnect(connectionId)
      onDestroy?.call(self, self)
    }}
    {...props}/>
}

export default Button