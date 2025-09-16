import Gtk from "gi://Gtk";
import GLib from "gi://GLib";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland";
import BaseWindow, { BaseWindowProps } from "./base";

export interface PopupWindowProps extends BaseWindowProps {}

const hyprland = Hyprland.get_default()
const XDG_RUNTIME_DIR = GLib.getenv("XDG_RUNTIME_DIR")

const PopupWindow = ({ name, $, visible = false, ...props}: PopupWindowProps) => {
  const bindCommand = `nc -U ${XDG_RUNTIME_DIR}/astal/${App.instanceName}.sock <<< $'hide_popup ${name}\\x04'`

  const motionHandler = new Gtk.EventControllerMotion()

  motionHandler.connect("enter", () => App.get_window(name as string)?.set_can_focus(true))
  motionHandler.connect("leave", () => App.get_window(name as string)?.set_can_focus(false))
  
  return <BaseWindow
    name={name}
    visible={visible}
    $={self => {
      self.add_controller(motionHandler)
      self.connect("hide", () => {
        const found = hyprland.get_binds().filter(b => b.arg === bindCommand)
        if (found) hyprland.message_async("keyword unbind , mouse:272", null)
      })
      self.connect('show', () => {
        const found = hyprland.get_binds().find(b => b.arg === bindCommand)
        if (!found) hyprland.message_async(`keyword bindn , mouse:272, exec, ${bindCommand}`, null)
      })
      if ($ !== undefined) $(self)
    }}
    {...props}>
  </BaseWindow>
}

export default PopupWindow