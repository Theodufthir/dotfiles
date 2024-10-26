import { TablerIcon } from "../tabler-icons.js"

const hyprland = await Service.import("hyprland")

const clientClassToIcon = {
  WebCord: "brand-discord",
  firefox: "brand-firefox",
  kitty: "terminal-2",
  foot: "terminal-2",
  "org.gnome.Nautilus": "folder",
  "org.gnome.Calculator": "calculator",
  "jetbrains-phpstorm": "brand-php",
  "jetbrains-pycharm": "brand-python",
  "com.gabm.satty": "photo-edit",
}

function getWorkspaceIcon(clientAddress) {
  let icon = null
  if (clientAddress == null) {
    icon = "circle-dashed"
  } else if (clientAddress === "0x0") {
    icon = "circle"
  } else {
    const clientClass = hyprland.clients.find(({address}) => address == clientAddress)?.class
    icon = clientClassToIcon[clientClass] ?? "circle-filled"
  }
  return icon
}

function getWorkspaceClasses(workspaceId, monitorId, currentMonitorId) {
  let classes = "highlightable"
  
  if (workspaceId === hyprland.active.workspace.id) {
    classes = " active-w"
  } else if (workspaceId === hyprland.getMonitor(monitorId)?.activeWorkspace.id) {
    classes += " visible-w"
  } else {
    classes += " other-w"
  }

  classes += monitorId === currentMonitorId ? " active-m" : " other-m"
  return classes
}

function Workspace({ id, ...workspace }, monitor) {
  const dispatchCmd = id < 0 ? `togglespecialworkspace ${workspace.name.substring(8)}` : `workspace ${id}`
  return Widget.Button({
    on_primary_click: () => hyprland.messageAsync("dispatch " + dispatchCmd),
    on_secondary_click: () => hyprland.messageAsync(`dispatch focusworkspaceoncurrentmonitor ${id}`),
		child: TablerIcon({ icon: getWorkspaceIcon(workspace.lastwindow) }),
		class_name: getWorkspaceClasses(id, workspace.monitorID, monitor),
    tooltip_text: workspace.lastwindowtitle ?? null
  })
}

function Workspaces(monitor) {
  const workspaces = hyprland.bind("workspaces")
    .as(ws => {
      const maxId = Math.max(...ws.map(w => w.id))
      const regularWorkspaces = [...Array(maxId)].map((_, id) => Workspace(
        hyprland.getWorkspace(id + 1) ?? { id: id + 1, lastwindow: null },
        monitor
      ))
      
      const specialWorkspaces = ws
        .filter(w => w.id < 0)
        .map(w => Workspace(w, monitor))

      if (specialWorkspaces.length > 0)
        specialWorkspaces.push(
          TablerIcon({
            icon: "minus-vertical",
            css: "margin: 0px -5px",
        }))

      return [
        ...specialWorkspaces,
        ...regularWorkspaces
      ]
    })

  return Widget.Box({
    class_name: "workspaces",
    children: workspaces,
    spacing: 6
  })
}

export {
  Workspaces
}
