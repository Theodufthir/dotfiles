import Wp from "gi://AstalWp";
import Button from "../../common/components/button";
import { nBind } from "../../../utils/variables";
import { Astal, Gtk } from "astal/gtk3"
import { getAudioEndpointIcon } from "../../../utils/audio";
import TablerIcon, { TablerIconName } from "../../common/components/tabler_icon";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const wp = Wp.get_default()


const Output = (output: Wp.Endpoint) =>
  <box spacing={10}>
    <box className="indicator">
      <TablerIcon icon={getAudioEndpointIcon(output) as TablerIconName}/>
      {nBind(output, "volume").as(v => `${(v * 100).toFixed(0)}%`)}
    </box>
    <Button className="highlightable"
            onPrimaryClick={_ => output.set_is_default(true)}>
      <label hexpand halign={Gtk.Align.END} label={output.description}/>
    </Button>
  </box>


const AudioPopup = (props: PopupWindowProps) => {
  const audio = wp?.audio
  if (audio === undefined)
    return null

  const outputs = nBind(audio, "speakers").as(s => s.map(Output))

  return <PopupWindow
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    layer={Astal.Layer.OVERLAY}
    visible={false}
    className="audio-popup"
    {...props}>
    <box className="base" vertical>
      Outputs
      <box className="output-list" vertical>
        {outputs}
      </box>
    </box>
  </PopupWindow>
}


export default AudioPopup
