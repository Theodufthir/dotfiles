import Button from "../common/components/button";
import TablerIcon from "../common/components/tabler_icon";
import { nBind } from "../../utils/variables"
import { Binding } from "astal"
import { MonitorNeededProps } from "../common/props/monitor";

import Hyprland from "gi://AstalHyprland";

const hyprland = Hyprland.get_default()

const classIcon: Map<string | undefined, string> = new Map([
  ["WebCord", "brand-discord"],
  ["firefox", "brand-firefox"],
  ["kitty", "terminal-2"],
  ["foot", "terminal-2"],
  ["Ardour", "wave-sine"],
  ["org.gnome.Nautils", "folder"],
  ["org.gnome.Calculatr", "calculator"],
  ["jetbrains-phpstorm", "brand-php"],
  ["jetbrains-pycharm", "brand-python"],
  ["com.gabm.satty", "photo-edit"],
  [undefined, "circle"] // existing but empty workspace
])

// added sync
nBind(hyprland, "focusedClient").subscribe(() => hyprland.sync_workspaces(null))

const dispatch = (cmd: string) => hyprland.message_async("dispatch " + cmd, null)

function getWorkspaceClasses(workspace: Hyprland.Workspace, currentMonitorId: number): Binding<string> {
  let classes = workspace.monitor.id === currentMonitorId ? "active-m" : "other-m"

  return nBind(hyprland, "focusedWorkspace").as(focusedWorkspace => {
    switch (workspace.id) {
      case focusedWorkspace.id:
        return classes + " active-w"
      case workspace.monitor.activeWorkspace.id:
        return classes + " highlightable visible-w"
      default:
        return classes + " highlightable other-w"
    }
  })
}

const Workspace = ({ workspace, monitor }: { workspace: Hyprland.Workspace, monitor: number }) => {
  const dispatchCmd = workspace.id < 0 ? `togglespecialworkspace ${workspace.name.substring(8)}` : `workspace ${workspace.id}`
  return <Button
    className={getWorkspaceClasses(workspace, monitor)}
    tooltip_text={nBind(workspace, "lastClient").as(c => c?.title ?? null)}
    onPrimaryClick={() => dispatch(dispatchCmd)}
    onSecondaryClick={() => dispatch(`focusworkspaceoncurrentmonitor ${workspace.id}`)
  }>
    <TablerIcon icon={nBind(workspace, "lastClient").as(c => classIcon.get(c?.class) ?? "circle-filled")} />
  </Button>
}

const Workspaces = ({ monitor }: MonitorNeededProps) => {
  const workspaces = nBind(hyprland, "workspaces")
    .as((ws: Hyprland.Workspace[]) => {
      const maxId = Math.max(...ws.map(w => w.id))
      const regularWorkspaces = [...Array(maxId)].map((_, id) => {
        const workspace = hyprland.get_workspace(id + 1)
        return workspace !== null ?
          <Workspace workspace={workspace} monitor={monitor}/> :
          <button className="highlightable other-w other-m"
                  onClicked={() => dispatch(`workspace ${id + 1}`)}>
            <TablerIcon icon="circle-dashed"/>
          </button>
      })

      const specialWorkspaces = ws
        .filter(w => w.id < 0)
        .map(w => <Workspace workspace={w} monitor={monitor}/>)

      if (specialWorkspaces.length > 0)
        specialWorkspaces.push(<TablerIcon icon="minus-vertical" className="separator"/>)

      return [
        ...specialWorkspaces,
        ...regularWorkspaces
      ]
    })

  return <box className="workspaces" spacing={6}>
    {workspaces}
  </box>
}

export default Workspaces
