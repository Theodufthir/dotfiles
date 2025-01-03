import Hyprland from "gi://AstalHyprland";
import { App } from "astal/gtk3"

const hyprland = Hyprland.get_default()

function registerMultiWorkspace(
  windowGenerator: ({ name, monitor }: { name: string, monitor: number }) => JSX.Element | null
) {
  const createWindow = (monitor: number) => windowGenerator({
    name: `${windowGenerator.name}-${monitor}`,
    monitor
  })

  hyprland.get_monitors().forEach(({id}) => createWindow(id))

  hyprland.connect("monitor-added", (_, monitor) => createWindow(monitor.id))
  hyprland.connect("monitor-removed", (_, monitor) => {
    const window = App.get_window(`${windowGenerator.name}-${monitor}`)
    if (window !== null) App.remove_window(window)
  })
}

function toggleOnCurrentMonitor(window: (_: any) => JSX.Element | null) {
  const currentMonitor = hyprland.get_focused_monitor().id
  App.toggle_window(`${window.name}-${currentMonitor}`)
}

export {
  registerMultiWorkspace,
  toggleOnCurrentMonitor
}