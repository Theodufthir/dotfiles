import { TablerIcon } from "./tabler-icons.js"
import { Popup, CustomButton } from "./popup.js"

const bluetooth = await Service.import("bluetooth")

function Device(device) {
  const icon = device.type.toLowerCase()

  const name = CustomButton({
    class_name: "highlightable",
    hexpand: true,
    hpack: "end",
    on_clicked: () => device.setConnection(!device.connected),
    child: Widget.Label({ label: device.name })
  })

  const indicator = Widget.Box({
    class_name: "indicator",
    children: [
      TablerIcon({ icon }),
      Widget.Label({
        label: ` ${device['battery-percentage']}%`,
        visible: device['battery-level'] !== 0, // doesn't work
      })
    ]
  })

  return Widget.Box({
    spacing: 10,
    children: [
      indicator,
      name
    ]
  })
}

function DevicesSection(title, { connected = null, paired = null }) {
  const getWidgets = () => [
    Widget.Label({ label: title }),
    ...bluetooth.devices.filter(device =>
      (connected ?? device.connected) === device.connected &&
      (paired ?? device.paired) === device.paired)
    .map(Device)
  ]

  const section = Utils.watch(getWidgets(), bluetooth.devices, getWidgets)

  return Widget.Box({
    class_name: "bluetooth-devices",
    vertical: true,
    children: section,
    visible: section.as(widgets => widgets.length > 1)
  })
}

const bluetoothNaming = (monitor) => 'bluetooth-popup-' + monitor;

function BluetoothWindow(monitor = 0) {
  return Popup({
    name: bluetoothNaming(monitor),
    monitor,
    class_name: "bluetooth-popup",
    layer: "overlay",
    anchor: ["top", "right"],
    margins: [10, 10, 0, 0],
    child: Widget.Box({
      vertical: true,
      class_name: "base",
      spacing: 2,
      children: [
        DevicesSection("Connected", { connected: true }),
        DevicesSection("Paired", { connected: false, paired: true }),
        DevicesSection("Detected", { paired: false })
      ]
    }),
  })
}

const Bluetooth = {
  naming: bluetoothNaming,
  Window: BluetoothWindow
}

export { Bluetooth }
