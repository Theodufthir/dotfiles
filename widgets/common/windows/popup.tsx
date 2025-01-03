import GLib from "gi://GLib"
import Hyprland from "gi://AstalHyprland"
import { App } from "astal/gtk3"
import BaseWindow, { BaseWindowProps } from "./base";

export interface PopupWindowProps extends BaseWindowProps {}

const hyprland = Hyprland.get_default()
const XDG_RUNTIME_DIR = GLib.getenv("XDG_RUNTIME_DIR")

const PopupWindow = ({ child, name, setup, visible = false, ...props}: PopupWindowProps) => {
  const bindCommand = `nc -U ${XDG_RUNTIME_DIR}/astal/${App.instanceName}.sock <<< $'hide_popup ${name}\\x04'`

  return <BaseWindow
    name={name}
    visible={visible}
    setup={self => {
      self.connect("hide", () => {
        const found = hyprland.get_binds().filter(b => b.arg === bindCommand)
        if (found) hyprland.message_async("keyword unbind , mouse:272", null)
      })
      self.connect('show', () => {
        const found = hyprland.get_binds().find(b => b.arg === bindCommand)
        if (!found) hyprland.message_async(`keyword bindn , mouse:272, exec, ${bindCommand}`, null)
      })
      if (setup !== undefined) setup(self)
    }}
    {...props}>
    <eventbox
      onHover={_ => App.get_window(name as string)?.set_accept_focus(true)}
      onHoverLost={_ => App.get_window(name as string)?.set_accept_focus(false)}>
      {child}
    </eventbox>
  </BaseWindow>
}

export default PopupWindow