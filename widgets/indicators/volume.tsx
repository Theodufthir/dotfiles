import WpSvc from "gi://AstalWp";
import Astal from "gi://Astal?version=4.0";
import TablerIcon from "../common/components/tabler_icon";
import { createMultiBinding, createRecBinding } from "../../utils/variables";
import EphemeralWindow, { EphemeralWindowProps } from "../common/windows/ephemeral";
import { getAudioEndpointIcon, getAudioEndpointVolumeIcon } from "../../utils/audio";

const wp = WpSvc.get_default()

const VolumeIndicator = (props: EphemeralWindowProps) => {
  const audio = wp?.get_audio()
  if (!audio) return null

  const volumeIcon = createMultiBinding(audio.defaultSpeaker, ["mute", "volume"], getAudioEndpointVolumeIcon)
  const deviceIcon = createMultiBinding(audio.defaultSpeaker, ["icon"], getAudioEndpointIcon)
  const popupTrigger = createMultiBinding(audio.defaultSpeaker, ["id", "mute", "volume"], () => undefined)

  return <EphemeralWindow
    name="VolumeIndicator"
    trigger={popupTrigger}
    anchor={Astal.WindowAnchor.BOTTOM}
    layer={Astal.Layer.OVERLAY}
    margin_bottom={100}
    {...props}>
    <box class="base floating-indicator volume" spacing={3}>
      <TablerIcon icon={createRecBinding(volumeIcon)}/>
      <slider class="bar-metric"
              drawValue={false}
              value={createRecBinding(audio, "defaultSpeaker", "volume")}/>
      <TablerIcon icon="minus-vertical" css="margin-right: -4px"/>
      <TablerIcon icon={createRecBinding(deviceIcon)}/>
    </box>
  </EphemeralWindow>
}

export default VolumeIndicator