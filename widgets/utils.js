const audio = await Service.import("audio")
const hyprland = await Service.import("hyprland")

function getAudioDeviceName(device) {
  if (device === null || device === undefined)
    return "None"
  return device['icon-name'].endsWith("bluetooth") ? device.origin : device.description
}

function getAudioDeviceIcon(device) {
  device ??= {}

  const iconMappings = {
    "audio-speakers": "device-speaker",
    "audio-speakers-bluetooth": "device-speaker",
    "audio-headset-bluetooth": "headset",
    "audio-headset": "headset",
    "video-display": "device-desktop",
  }

  return iconMappings[device['icon-name']] ?? "speakerphone"
}

function hyprToGdkMonitorId(monitorId) {
  return hyprland.monitors.findIndex(({id}) => id === monitorId)
}

export {
  getAudioDeviceName,
  getAudioDeviceIcon,
  hyprToGdkMonitorId
}
