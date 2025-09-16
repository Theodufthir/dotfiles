import Gtk from "gi://Gtk";
import Astal from "gi://Astal?version=4.0";
import Button from "../../common/components/button";
import Network from "gi://AstalNetwork";
import TablerIcon from "../../common/components/tabler_icon";
import { execAsync } from "ags/process";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";
import { createBinding, createComputed, For} from "gnim";

const network = Network.get_default()


const Wifi = (wifi: Network.AccessPoint) => {//{ wifi }: { wifi: Network.AccessPoint }) => {
  const icon = createComputed([
    createBinding(wifi, "strength"),
    createBinding(network.wifi, "active_access_point")
  ], (strength, activeWifi) =>
    wifi === activeWifi ? "check" : (strength < 75 ? ("wifi-" + Math.floor(strength/ 25)) : "wifi")
  )

  const toggleConnection = () => {
    const cmd = network.wifi.internet !== Network.Internet.DISCONNECTED && network.wifi.ssid === wifi.ssid ?
      `disconnect ${network.wifi.device.interface}` : `wifi connect ${wifi.ssid}`
    execAsync(`nmcli device ${cmd}`).then(console.log).catch(console.log)
  }

  return <box spacing={10} class="wifi-item">
    <box class="indicator">
      <TablerIcon icon={icon}/>
      <label label={
        createBinding(wifi, "frequency").as(f => `${(f / 1000).toFixed(1)}GHz`)
      }/>
    </box>
    <Button class="highlightable"
            onPrimaryClick={toggleConnection}>
      <label hexpand halign={Gtk.Align.END}
             tooltipText={wifi.ssid ?? wifi.bssid}
             label={wifi.ssid ?? wifi.bssid}/>
    </Button>
  </box>
}


const NetworkPopup = (props: PopupWindowProps) => {
  const wifis = createBinding(network.wifi, "accessPoints").as(wfs => wfs
    .sort((a,b) => b.strength - a.strength))

  return <PopupWindow
    class="network-popup"
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.OVERLAY}
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    $={self => self.connect("show", () => network.wifi.scan())}
    {...props}>
    <box class="base" orientation={Gtk.Orientation.VERTICAL}>
      Wifis
      <box class="wifi-list" orientation={Gtk.Orientation.VERTICAL}>
        <For each={wifis}>
          {Wifi}
        </For>
      </box>
    </box>
  </PopupWindow>
}

export default NetworkPopup
