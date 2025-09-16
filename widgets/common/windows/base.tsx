import App from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import Hyprland from "gi://AstalHyprland";
import { CCProps } from "gnim";

export interface BaseWindowProps extends Partial<CCProps<Astal.Window, Astal.Window.ConstructorProps>> {
  monitor: number
}

const hyprland = Hyprland.get_default()

const BaseWindow = ({ monitor = 0, ...props }: BaseWindowProps) => {
  const gdkMonitorId = hyprland.get_monitors().reverse().findIndex(({id}) => id === monitor)
  return <window
    visible
    application={App}
    monitor={gdkMonitorId}
    {...props}/>
}

export default BaseWindow