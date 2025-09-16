import Gtk from "gi://Gtk";
import Astal from "gi://Astal?version=4.0";
import Button from "../../common/components/button";
import { exec } from "ags/process";
import TablerIcon, { TablerIconName } from "../../common/components/tabler_icon";
import { hibernate, poweroff, reboot } from "../../../utils/power";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";


type PowerButtonProps = {
  text: string;
  action: () => any;
  icon: TablerIconName;
}


const PowerButton = ({ text, icon, action }: PowerButtonProps) => (
  <box spacing={10}>
    <TablerIcon icon={icon}/>
    <Button class="highlightable" onPrimaryClick={action}>
    <label hexpand halign={Gtk.Align.END} label={text}/>
    </Button>
  </box>
)


const PowerPopup = (props: PopupWindowProps) => (
  <PopupWindow
    class="power-popup"
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.OVERLAY}
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    {...props}>
    <box class="base" orientation={Gtk.Orientation.VERTICAL}>
      <PowerButton text="Log out" icon="logout-2" action={() => exec("logout")}/>
      <PowerButton text="Hibernate" icon="snowflake" action={hibernate}/>
      <PowerButton text="Reboot" icon="reload" action={reboot}/>
      <PowerButton text="Power off" icon="power" action={poweroff}/>
    </box>
  </PopupWindow>
)


export default PowerPopup