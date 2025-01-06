import Tray from "./tray";
import Media from "./media";
import TraySvc from "gi://AstalTray";
import TablerIcon from "../common/components/tabler_icon";
import Workspaces from "./workspaces"
import Notifications from "./notifications";
import { nBind } from "../../utils/variables";
import { Astal, Gtk } from "astal/gtk3"
import BaseWindow, { BaseWindowProps } from "../common/windows/base";
import { Battery, Bluetooth, Brightness, Network, Time, Volume } from "./sideinfos";

const Bar = ({ monitor = 0, ...props }: BaseWindowProps) => <BaseWindow
  name="Bar"
  className="bar-window"
  anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
  exclusivity={Astal.Exclusivity.EXCLUSIVE}
  monitor={monitor}
  {...props}>
  <centerbox margin={10} marginBottom={0}>
    <box className="base"
         spacing={6}
         halign={Gtk.Align.START}>
      <Workspaces monitor={monitor}/>
      <Notifications/>
    </box>
    <box className="base">
      <Media/>
    </box>
    <box className="base sideinfos"
         halign={Gtk.Align.END}
         spacing={6}>
      <box visible={nBind(TraySvc.get_default(), "items").as(its => its.length > 0)}>
        <Tray/>
        <TablerIcon icon="minus-vertical" css="margin: 0px -4px 0px 2px"/>
      </box>
      <Volume/>
      <Brightness/>
      <Bluetooth/>
      <Network/>
      <Battery/>
      <Time/>
    </box>
  </centerbox>
</BaseWindow>

export default Bar