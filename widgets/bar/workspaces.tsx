import Button from "../common/components/button";
import Hyprland from "gi://AstalHyprland";
import TablerIcon from "../common/components/tabler_icon";
import { createBinding, Accessor, For } from "gnim";
import { MonitorNeededProps } from "../common/props/monitor";

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
  ["jetbrains-webstorm", "brand-typescript"],
  ["jetbrains-rider", "brand-c-sharp"],
  ["com.gabm.satty", "photo-edit"],
  [undefined, "circle"] // existing but empty workspace
])


const dispatch = (cmd: string) => hyprland.message_async("dispatch " + cmd, null)

function getWorkspaceClasses(workspace: Hyprland.Workspace, currentMonitorId: number): Accessor<string> {
  return createBinding(hyprland, "focusedWorkspace").as(focusedWorkspace => {
    let classes = workspace.monitor?.id === currentMonitorId ? "active-m" : "other-m"
    switch (workspace.id) {
      case focusedWorkspace?.id:
        return classes + " active-w"
      case workspace.monitor?.activeWorkspace?.id:
        return classes + " highlightable visible-w"
      default:
        return classes + " highlightable other-w"
    }
  })
}

const Workspace = ({ workspace, monitor }: { workspace: Hyprland.Workspace, monitor: number }) => {
  const dispatchCmd = workspace.id < 0 ? `togglespecialworkspace ${workspace.name.substring(8)}` : `workspace ${workspace.id}`
  return <Button
    class={getWorkspaceClasses(workspace, monitor)}
    tooltip_text={createBinding(workspace, "lastClient").as(c => c?.title ?? null)}
    onPrimaryClick={() => dispatch(dispatchCmd)}
    onSecondaryClick={() => dispatch(`focusworkspaceoncurrentmonitor ${workspace.id}`)
  }>
    <TablerIcon icon={createBinding(workspace, "lastClient").as(c => classIcon.get(c?.class) ?? "circle-filled")} />
  </Button>
}

const Workspaces = ({ monitor }: MonitorNeededProps) => {
  const workspaces = createBinding(hyprland, "workspaces")
    .as((ws: Hyprland.Workspace[]) => {
      const maxId = Math.max(...ws.map(w => w.id))
      const regularWorkspaces = [...Array(maxId)].map((_, id) => {
        const workspace = hyprland.get_workspace(id + 1)
        return workspace !== null ?
          <Workspace workspace={workspace} monitor={monitor}/> :
          <button class="highlightable other-w other-m"
                  onClicked={() => dispatch(`workspace ${id + 1}`)}>
            <TablerIcon icon="circle-dashed"/>
          </button>
      })

      const specialWorkspaces = ws
        .filter(w => w.id < 0)
        .map(w => <Workspace workspace={w} monitor={monitor}/>)

      if (specialWorkspaces.length > 0)
        specialWorkspaces.push(<TablerIcon icon="minus-vertical" class="separator"/>)

      return [
        ...specialWorkspaces,
        ...regularWorkspaces
      ]
    })

  // additional sync
  const cleanup = createBinding(hyprland, "focusedClient").subscribe(() =>
      hyprland.sync_workspaces(null)
  )

  return <box
    class="workspaces"
    spacing={6}
    onDestroy={cleanup}
  >
    <For each={workspaces}>
      {(workspace) => workspace}
    </For>
  </box>
}

export default Workspaces
