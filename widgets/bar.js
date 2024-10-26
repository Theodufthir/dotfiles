import { Media } from "./bar/media.js"
import { SysTray } from "./bar/systray.js"
import { Workspaces } from "./bar/workspaces.js"
import { TablerIcon } from "./tabler-icons.js"
import { HoverRevealer } from "./custom.js"
import { Notifications } from "./bar/notifications.js"
import { Volume, Battery, Bluetooth, Brightness, Network, Time } from "./bar/sideinfos.js"

const hyprland = await Service.import("hyprland")
const systemtray = await Service.import("systemtray")

function Left(monitor = 0) {
  return Widget.Box({
    hpack: "start",
    class_name: "base",
    spacing: 6,
    children: [
      Workspaces(monitor),
      Notifications(),
    ],
  })
}

function Center(monitor) {
  return Widget.Box({
    class_name: "base",
    vpack: 'fill',
    children: [
      Media(monitor),
    ],
  })
}

function Right(monitor = 0) {
  const systray = Widget.Box({
    children: [
      SysTray(),
      TablerIcon({
        icon: "minus-vertical",
        css: "margin-left: 1px; margin-right: -5px",
      }),
    ],
    visible: systemtray.bind("items").as(i => i.length > 0) 
  })

  return Widget.Box({
    hpack: "end",
    class_name: "base sideinfos",
    spacing: 6,
    children: [
      systray,
      Volume(monitor),
      Brightness(monitor),
      Bluetooth(monitor),
      Network(monitor),
      Battery(),
      Time()
    ],
  })
}

const barNaming = (monitor) => 'bar-window-' + monitor;

function BarWindow(monitor = 0) {
  const lockShow = Variable(true)
  const content = HoverRevealer({
    displayed: Widget.Box({ css: "min-height: 1px" }),
    revealed: Widget.CenterBox({
      css: "margin: 9px 10px 0px 10px",
      start_widget: Left(monitor),
      center_widget: Center(monitor),
      end_widget: Right(monitor),
    }),
    transition: "slide_down",
    transition_duration: 100,
    lock_reveal: lockShow
  })
  return Widget.Window({
    name: barNaming(monitor),
    monitor,
    class_name: "bar-window",
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    attribute: null,
    layer: "bottom",
    child: content
  }).on('notify::attribute', (self) => {
    const autohide = self.attribute === "autohide"
    App.closeWindow(self.name)
    self.layer = autohide ? "overlay" : "bottom"
    lockShow.value = autohide ? null : true
    App.openWindow(self.name)
  })
}

const Bar = {
  naming: barNaming,
  Window: BarWindow
}

export { Bar }

