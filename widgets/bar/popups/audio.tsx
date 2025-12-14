import Wp from "gi://AstalWp";
import Gtk from "gi://Gtk";
import Pango from "gi://Pango";
import Astal from "gi://Astal?version=4.0";
import Button from "../../common/components/button";
import TablerIcon from "../../common/components/tabler_icon";
import { createBinding, For } from "gnim";
import { getAudioEndpointIcon } from "../../../utils/audio";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const wp = Wp.get_default()


const Output = (output: Wp.Endpoint) =>
  <box spacing={10} class="output-item">
    <box class="indicator">
      <TablerIcon icon={getAudioEndpointIcon(output)}/>
      <label label={
        createBinding(output, "volume").as(v => `${(v * 100).toFixed(0)}%`)
      }/>
    </box>
    <Button class="highlightable"
            onPrimaryClick={_ => output.set_is_default(true)}>
      <label hexpand halign={Gtk.Align.END}
             tooltipText={output.description}
             label={output.description}
             ellipsize={Pango.EllipsizeMode.MIDDLE}
             maxWidthChars={25}/>
    </Button>
  </box>


const AudioPopup = (props: PopupWindowProps) => {
  const audio = wp?.audio
  if (audio === undefined)
    return null

  return <PopupWindow
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    layer={Astal.Layer.OVERLAY}
    visible={false}
    class="audio-popup"
    {...props}>
    <box class="base" orientation={Gtk.Orientation.VERTICAL}>
      Outputs
      <box class="output-list" orientation={Gtk.Orientation.VERTICAL}>
        <For each={createBinding(audio, "speakers")}>
          {Output}
        </For>
      </box>
    </box>
  </PopupWindow>
}


export default AudioPopup
