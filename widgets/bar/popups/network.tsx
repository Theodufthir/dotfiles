import Button from "../../common/components/button";
import Network from "gi://AstalNetwork"
import TablerIcon from "../../common/components/tabler_icon"
import { nBind } from "../../../utils/variables";
import { Astal, Gtk } from "astal/gtk3"
import { execAsync, Variable } from "astal"
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const network = Network.get_default()


const Wifi = (wifi: Network.AccessPoint) => {
  const icon = Variable.derive(
    [nBind(wifi, "strength"), nBind(network.wifi, "activeAccessPoint")],
    (strength, active) => wifi === active ? "check" : (strength < 75 ? ("wifi-" + Math.floor(strength / 25)) : "wifi")
  )

  const toggleConnection = () => {
    const cmd = network.wifi.internet !== Network.Internet.DISCONNECTED && network.wifi.ssid === wifi.ssid ?
      `disconnect ${network.wifi.device.interface}` : `wifi connect ${wifi.ssid}`
    execAsync(`nmcli device ${cmd}`).then(console.log).catch(console.log)
  }

  return <box spacing={10} className="wifi-item">
    <box className="indicator">
      <TablerIcon icon={nBind(icon)} onDestroy={() => icon.drop()}/>
      {nBind(wifi, "frequency").as(f => `${(f / 1000).toFixed(1)}GHz`)}
    </box>
    <Button className="highlightable"
            onPrimaryClick={toggleConnection}>
      <label truncate hexpand halign={Gtk.Align.END}
             tooltipText={wifi.ssid ?? wifi.bssid}
             label={wifi.ssid ?? wifi.bssid}/>
    </Button>
  </box>
}


const NetworkPopup = (props: PopupWindowProps) => {
  const wifis = nBind(network.wifi, "accessPoints").as(wfs => wfs
    .sort((a,b) => b.strength - a.strength)
    .map(Wifi))

  return <PopupWindow
    className="network-popup"
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.OVERLAY}
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    setup={self => self.connect("show", () => network.wifi.scan())}
    {...props}>
    <box className="base" vertical>
      Wifis
      <box className="wifi-list" vertical>
        {wifis}
      </box>
    </box>
  </PopupWindow>
}

export default NetworkPopup
