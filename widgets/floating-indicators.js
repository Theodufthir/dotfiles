import { TablerIcon } from "./tabler-icons.js"
import { getAudioDeviceIcon } from "./utils.js"
import { hyprToGdkMonitorId } from "./utils.js"

import brightness from "../services/brightness.js"
const audio = await Service.import("audio")
const hyprland = await Service.import("hyprland")

function Volume() {
  function getVolumeIcon() {
    const speaker = audio.speaker 
    let suffix = ""
    if (speaker.is_muted) {
      suffix = "-off"
    } else if (speaker.volume === 0) {
      suffix = "-3"
    } else if (speaker.volume < 0.5) {
      suffix = "-2"
    }
    return "volume" + suffix
  }

  function getDeviceIcon() {
    const stream = audio.speaker.stream
    const device = stream ? audio.control.lookup_device_from_stream(stream) : null
    return getAudioDeviceIcon(device)
  }

  const iconVolume = TablerIcon({ icon: Utils.watch(getVolumeIcon(), audio.speaker, getVolumeIcon) })
  const iconDevice = TablerIcon({ icon: Utils.watch(getDeviceIcon(), audio.speaker, getDeviceIcon) })
  const separator = TablerIcon({ icon: "minus-vertical", css: "margin-right: -4px" })

  const slider = Widget.Slider({
    hexpand: true,
    draw_value: false,
    class_name: "bar-metric",
    value: audio.speaker.bind("volume")
  })

  return Widget.Box({
    class_name: "base floating-indicator volume",
    spacing: 3,
    children: [iconVolume, slider, separator, iconDevice],
  })
}

const volumeFloatingIndicatorNaming = (monitor) => 'volume-floating-indicator-' + monitor

function VolumeFloatingIndicatorWindow(monitor = 0) {
  return Widget.Window({
    name: volumeFloatingIndicatorNaming(monitor),
    monitor: hyprToGdkMonitorId(monitor),
    layer: "overlay",
    child: Volume(),
    margins: ["100"],
    anchor: ["bottom"],
    visible: false
  })
}


function Brightness() {
  const icon = TablerIcon({ icon: brightness.bind("screen-value").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : "")) })

  const slider = Widget.Slider({
    hexpand: true,
    draw_value: false,
    class_name: "bar-metric",
    value: brightness.bind("screen-value")
  })

  return Widget.Box({
    class_name: "base floating-indicator brightness",
    spacing: 3,
    children: [icon, slider],
  })
}

const brightnessFloatingIndicatorNaming = (monitor) => 'brightness-floating-indicator-' + monitor

function BrightnessFloatingIndicatorWindow(monitor = 0) {
  return Widget.Window({
    name: brightnessFloatingIndicatorNaming(monitor),
    monitor: hyprToGdkMonitorId(monitor),
    layer: "overlay",
    child: Brightness(),
    margins: ["100"],
    anchor: ["bottom"],
    visible: false
  })
}


const VolumeFloatingIndicator = {
  naming: volumeFloatingIndicatorNaming,
  Window: VolumeFloatingIndicatorWindow
}

const BrightnessFloatingIndicator = {
  naming: brightnessFloatingIndicatorNaming,
  Window: BrightnessFloatingIndicatorWindow
}

export {
  VolumeFloatingIndicator,
  BrightnessFloatingIndicator,
}
