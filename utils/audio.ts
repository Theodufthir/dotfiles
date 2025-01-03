import Wp from "gi://AstalWp"

function getAudioEndpointName({ icon, name, description }: Wp.Endpoint): string {
  return icon.endsWith("bluetooth") ? name : description
}

function getAudioEndpointIcon({ icon }: Wp.Endpoint): string {
  const iconMappings = new Map<string, string>([
    ["audio-speakers", "device-speaker"],
    ["audio-speakers-bluetooth", "device-speaker"],
    ["audio-headset-bluetooth", "headset"],
    ["audio-headset", "headset"],
    ["video-display", "device-desktop"],
  ])

  return iconMappings.get(icon ?? "") ?? "speakerphone"
}

function getAudioEndpointVolumeIcon({ mute, volume }: Wp.Endpoint) {
  let suffix = ""
  if (mute) {
    suffix = "-off"
  } else if (volume === 0) {
    suffix = "-3"
  } else if (volume < 0.5) {
    suffix = "-2"
  }
  return "volume" + suffix
}

export {
  getAudioEndpointName,
  getAudioEndpointIcon,
  getAudioEndpointVolumeIcon
}