import { TablerIcon } from "./tabler-icons.js"
import { Popup, CustomButton } from "./popup.js"

const network = await Service.import("network")

function Wifi(wifi) {
  const icon = wifi.active ? "check" : (wifi.strength < 75 ? ("wifi-" + Math.floor(wifi.strength / 25)) : "wifi")

  const indicator = Widget.Box({
    class_name: "indicator",
    children: [
      TablerIcon({ icon }),
      Widget.Label({ label: (wifi.frequency / 1000).toFixed(1).toString() + "GHz" })
    ]
  })

  const name = CustomButton({
    class_name: "highlightable",
    child: Widget.Label({
      label: wifi.ssid,
      hexpand: true,
      hpack: "end"
    }),
    on_clicked: () => Utils.execAsync(`nmcli d wifi connect ${wifi.ssid}`)
  })

  return Widget.Box({
    spacing: 10,
    children: [
      indicator,
      name
    ]
  })
}

function Wifis() {
  const wifis = network.wifi.bind("access-points").as(wfs => wfs
      .sort((a,b) => b.strength - a.strength)
      .map(Wifi))

  return Widget.Box({
    class_name: "wifi-list",
    vertical: true,
    children: wifis
  })
}

const networkNaming = (monitor) => 'network-popup-' + monitor;

function NetworkWindow(monitor = 0) {
  return Popup({
    name: networkNaming(monitor),
    monitor,
    class_name: "network-popup",
    exclusivity: "exclusive",
    layer: "overlay",
    anchor: ["top", "right"],
    margins: [10, 10, 0, 0],
    child: Widget.Box({
      vertical: true,
      class_name: "base",
      children: [
        Widget.Label({ label: "Wifis" }),
        Wifis(),
      ]
    }),
  }).on("show", network.wifi.scan)
}

const Network = {
  naming: networkNaming,
  Window: NetworkWindow
}

export { Network }
