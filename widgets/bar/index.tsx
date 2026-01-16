import Gtk from "gi://Gtk";
import Astal from "gi://Astal?version=4.0";
import TraySvc from "gi://AstalTray";
import Tray from "./tray";
import Media from "./media";
import Workspaces from "./workspaces";
import Notifications from "./notifications";
import TablerIcon from "../common/components/tabler_icon";
import { createBinding } from "gnim";
import BaseWindow, { BaseWindowProps } from "../common/windows/base";
import { Battery, Bluetooth, Brightness, Network, Power, Time, Volume } from "./sideinfos";

const Bar = ({ monitor = 0, ...props }: BaseWindowProps) => <BaseWindow
  name="Bar"
  class="bar-window"
  anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
  exclusivity={Astal.Exclusivity.EXCLUSIVE}
  monitor={monitor}
  layer={Astal.Layer.OVERLAY}
  margin={10}
  margin_bottom={0}
  {...props}>
  <centerbox>
    <box class="base"
         spacing={6}
         $type="start"
         halign={Gtk.Align.START}>
      <Workspaces monitor={monitor}/>
      <Notifications/>
    </box>
    <box $type="center" class="base">
      <Media/>
    </box>
    <box class="base sideinfos"
         $type="end"
         halign={Gtk.Align.END}
         spacing={6}>
      <box visible={createBinding(TraySvc.get_default(), "items").as(its => its.length > 0)}>
        <Tray/>
        <TablerIcon icon="minus-vertical" css="margin: 0px -4px 0px 2px"/>
      </box>
      <Volume/>
      <Brightness/>
      <Bluetooth/>
      <Network/>
      <Battery/>
      <Power/>
      <Time/>
    </box>
  </centerbox>
</BaseWindow>

export default Bar