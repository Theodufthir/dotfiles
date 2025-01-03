import Hyprland from "gi://AstalHyprland"
import { Widget, App } from "astal/gtk3"

export interface BaseWindowProps extends Widget.WindowProps {
  monitor?: number
}

const hyprland = Hyprland.get_default()

const BaseWindow = ({ monitor = 0, setup, ...props }: BaseWindowProps) => {
  const gdkMonitorId = hyprland.get_monitors().reverse().findIndex(({id}) => id === monitor)
  return <window
    monitor={gdkMonitorId}
    setup={self => {
      if (setup !== undefined) setup(self)
      App.add_window(self)
    }}
    {...props}/>
}

export default BaseWindow