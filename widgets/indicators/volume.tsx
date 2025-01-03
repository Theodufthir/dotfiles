import TablerIcon from "../common/components/tabler_icon";
import { Astal } from "astal/gtk3"
import {getAudioEndpointIcon, getAudioEndpointName, getAudioEndpointVolumeIcon} from "../../utils/audio";
import { nDerive, nBind, nTrigger } from "../../utils/variables"
import EphemeralWindow, { EphemeralWindowProps } from "../common/windows/ephemeral";

import WpSvc from "gi://AstalWp";
const wp = WpSvc.get_default()

const VolumeIndicator = (props: EphemeralWindowProps) => {
  const audio = wp?.get_audio()
  if (!audio) return null

  const volumeIcon = nDerive(audio.defaultSpeaker, ["mute", "volume"], getAudioEndpointVolumeIcon)
  const deviceIcon = nDerive(audio.defaultSpeaker, ["icon"], getAudioEndpointIcon)
  const popupTrigger = nTrigger(audio.defaultSpeaker, ["id", "mute", "volume"])

  return <EphemeralWindow
    name="VolumeIndicator"
    trigger={nBind(popupTrigger)}
    anchor={Astal.WindowAnchor.BOTTOM}
    layer={Astal.Layer.OVERLAY}
    margin_bottom={100}
    onDestroy={popupTrigger.drop}
    {...props}>
    <box className="base floating-indicator volume" spacing={3}>
      <TablerIcon icon={nBind(volumeIcon)} onDestroy={volumeIcon.drop}/>
      <slider className="bar-metric"
              drawValue={false}
              value={nBind(audio, "defaultSpeaker", "volume")}/>
      <TablerIcon icon="minus-vertical" css="margin-right: -4px"/>
      <TablerIcon icon={nBind(deviceIcon)} onDestroy={deviceIcon.drop}/>
    </box>
  </EphemeralWindow>
}

export default VolumeIndicator