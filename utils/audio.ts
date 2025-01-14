import Wp from "gi://AstalWp"
import { TablerIconName } from "../widgets/common/components/tabler_icon";

function getAudioEndpointName({ icon, name, description }: Wp.Endpoint): string {
  return icon.endsWith("bluetooth") ? name : description
}

function getAudioEndpointIcon({ icon }: Wp.Endpoint): TablerIconName {
  const iconMappings = new Map<string, TablerIconName>([
    ["audio-speakers", "device-speaker"],
    ["audio-speakers-bluetooth", "device-speaker"],
    ["audio-headset-bluetooth", "headset"],
    ["audio-headset", "headset"],
    ["video-display", "device-desktop"],
  ])

  return iconMappings.get(icon ?? "") ?? "speakerphone"
}

function getAudioEndpointVolumeIcon({ mute, volume }: Wp.Endpoint): TablerIconName {
  if (mute) {
    return "volume-off"
  } else if (volume === 0) {
    return "volume-3"
  } else if (volume < 0.5) {
    return "volume-2"
  } else {
    return "volume"
  }
}

export {
  getAudioEndpointName,
  getAudioEndpointIcon,
  getAudioEndpointVolumeIcon
}