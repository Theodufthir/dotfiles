import { TablerIcon } from "../tabler-icons.js"
import { Audio as AudioWindow } from "../audio.js"
import { Network as NetworkWindow } from "../network.js"
import { Bluetooth as BluetoothWindow } from "../bluetooth.js"
import { getAudioDeviceName, getAudioDeviceIcon } from "../utils.js"
import { HoverRevealer, HoverSwitcher, AutoStack } from "../custom.js"

import brightness from "../../services/brightness.js"
const audio = await Service.import("audio")
const battery = await Service.import("battery")
const bluetooth = await Service.import("bluetooth")
const network = await Service.import("network")
const powerProfiles = await Service.import("powerprofiles")

const date = Variable("", {
  poll: [1000, 'date "+%H:%M"'],
})

function Time() {
  return Widget.Label({ label: date.bind() })
}


function Bluetooth(monitor = 0) {
  function getIcon() {
    let icon = "bluetooth"
    if (!bluetooth.enabled) {
      icon += "-off"
    } else if (bluetooth["connected-devices"].length > 0) {
      icon += "-connected"
    }
    return icon
  }

  const tooltipText = () => bluetooth["connected-devices"].length + " device(s) connected"

  return Widget.Button({
    on_primary_click: () => App.toggleWindow(BluetoothWindow.naming(monitor)),
    on_secondary_click: () => bluetooth.enabled = !bluetooth.enabled,
    child: TablerIcon({ icon: Utils.watch(getIcon(), bluetooth, getIcon) }),
    class_name: "highlightable",
    tooltip_text: Utils.watch(tooltipText(), bluetooth, tooltipText)
  });
}


function Network(monitor = 0) {
  function getIcon() {
    if (network.primary === "wifi") {
      let suffix = ""
      if (network.wifi.internet === "connecting") {
        return "refresh"
      } else if (network.wifi.internet === "disconnected") {
        suffix = "-off"
      } else if (network.wifi.strength < 75) {
        suffix = "-" + Math.floor(network.wifi.strength / 25)
      }
      return "wifi" + suffix
    } else if (network.primary === "wired") {
      return "network"
    } else {
      return "router-off"
    }
  }
  
  function tooltipText() {
    if (network.primary === "wifi") {
      return network.wifi.ssid
    } else if (network.primary === "wired") {
      return "Ethernet"
    } else {
      return "No connection"
    }
  } 

  return Widget.Button({
    on_primary_click: () => App.toggleWindow(NetworkWindow.naming(monitor)),
    on_secondary_click: () => network.toggleWifi(),
    child: TablerIcon({ icon: Utils.watch(getIcon(), network, getIcon) }),
    tooltip_text: Utils.watch(tooltipText(), network, tooltipText),
    class_name: "highlightable"
  })
}


function Brightness(monitor) {
  const icon = TablerIcon({ icon: brightness.bind("screen-value").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : "")) })
 
  const slider = Widget.Slider({
    draw_value: false,
    class_name: "slider highlightable",
    on_change: ({ value }) => brightness.screenValue = value,
    value: brightness.bind("screen-value")
  })

  return HoverRevealer({
    displayed: icon,
    revealed: slider,
    transition: "slide_right",
    transition_duration: 400,
  })
}


function Volume(monitor) {
  function getIcon() {
    let suffix = ""
    if (audio.speaker.is_muted) {
      suffix = "-off"
    } else if (audio.speaker.volume === 0) {
      suffix = "-3"
    } else if (audio.speaker.volume < 0.5) {
      suffix = "-2"
    }
    return "volume" + suffix
  }

  function tooltipText() {
    const stream  = audio.speaker.stream
    const device = stream ? audio.control.lookup_device_from_stream(stream) : null
    return getAudioDeviceName(device)
  }

  const button = Widget.Button({
    on_primary_click: () => App.openWindow(AudioWindow.naming(monitor)),
    on_secondary_click: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    child: TablerIcon({ icon: Utils.watch(getIcon(), audio.speaker, getIcon) }),
    tooltip_text: Utils.watch(tooltipText(), audio.speaker, tooltipText),
    class_name: "highlightable"
  })

  const slider = Widget.Slider({
    draw_value: false,
    class_name: "slider highlightable",
    value: audio.speaker.bind("volume"),
    on_change: ({ value }) => audio.speaker.volume = value,
  })

  return HoverRevealer({
    displayed: button,
    revealed: slider,
    transition: "slide_right",
    transition_duration: 400,
  })
}


function Battery() {
  function switchProfiles() {
    const { profiles, activeProfile, ...other } = powerProfiles
    const activeIndex = profiles.findIndex(e => e.Profile === activeProfile)
    const nextIndex = (activeIndex + 1) % profiles.length
    powerProfiles.activeProfile = profiles[nextIndex].Profile
  }

  const hovered = Variable(false)

  const modeIcon = powerProfiles.bind("active-profile").as(profile => 
    "battery-vertical" + { "power-saver": "-eco", "performance": "-exclamation", "balanced": "" }[profile])

  const overlayIcon = Utils.merge([battery.bind("charging"), hovered.bind(), modeIcon], (charging, hovered, modeIcon) =>
    (!hovered && charging) ? "battery-vertical-charging-2" : modeIcon)

  const tooltipText = Utils.merge(["percent", "time-remaining"].map(n => battery.bind(n)), (percent, seconds) => 
    `${percent}% : ` + (seconds > 3600 ? `${(seconds/3600).toFixed(1)}h` : `${(seconds/60).toFixed(0)}m`))

  const batteryIcon = Widget.Overlay({
    child: TablerIcon({
      icon: battery.bind("percent").as(p => `battery-vertical${p > 15 ? "-" + Math.round(p / 25) : ""}`),
      class_name: "bars"
    }),
    overlays: [
      TablerIcon({ icon: "battery-vertical", class_name: "in-between" }),
      TablerIcon({ icon: overlayIcon })
    ],
    pass_through: true
  })

  return Widget.Button({
    class_name: "battery highlightable",
    visible: battery.bind("available"),
    on_secondary_click: switchProfiles,
    child: batteryIcon,
    on_hover: () => hovered.value = true,
    on_hover_lost: () => hovered.value = false,
    tooltip_text: tooltipText
  })
}

export {
  Battery,
  Bluetooth,
  Brightness,
  Volume,
  Time,
  Network
}
