import Gtk from "gi://Gtk";
import Astal from "gi://Astal?version=4.0";
import Mpris from "gi://AstalMpris";
import Pango from "gi://Pango";
import Button from "../../common/components/button";
import { createPoll } from "ags/time";
import { Accessor, createBinding, For, With } from "gnim";
import TablerIcon, { TablerIconName } from "../../common/components/tabler_icon";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const mpris = Mpris.get_default()


const Infos = (player: Mpris.Player) =>
  <box orientation={Gtk.Orientation.VERTICAL}>
    <label label={createBinding(player, "title")}
           tooltipText={createBinding(player, "title")}
           ellipsize={Pango.EllipsizeMode.END}
           maxWidthChars={35}/>
    <label label={createBinding(player, "artist")}
           tooltipText={createBinding(player, "artist")}
           ellipsize={Pango.EllipsizeMode.END}
           maxWidthChars={35}/>
    <label label={createBinding(player, "album")}
           tooltipText={createBinding(player, "album")}
           ellipsize={Pango.EllipsizeMode.END}
           maxWidthChars={35}/>
  </box>


interface ControlProps { icon: TablerIconName | Accessor<string>; callback: () => void; sensitive: Accessor<boolean>; }

const Control = ({ sensitive, callback, icon }: ControlProps) =>
  <Button class={sensitive.as(s => s ? "highlightable" : "disabled")}
    onPrimaryClick={callback} sensitive={sensitive}>
    <TablerIcon icon={icon}/>
  </Button>


const Controls = (player: Mpris.Player) =>
  <box class="controls" homogeneous>
    <Control icon="player-track-prev" callback={() => player.previous()} sensitive={createBinding(player, "canGoPrevious")}/>
    <Control icon="rewind-backward-5" sensitive={createBinding(player, "canPlay")}
             callback={() => player.position = Math.max(player.position - 5, 0)}/>
    <Control callback={() => player.play_pause()} sensitive={createBinding(player, "canPlay")}
             icon={createBinding(player, "playbackStatus").as(s => `player-${s === Mpris.PlaybackStatus.PLAYING ? "pause" : "play"}`)}/>
    <Control icon="rewind-forward-5" sensitive={createBinding(player, "canPlay")}
             callback={() => player.position = Math.min(player.position + 5, player.length)}/>
    <Control icon="player-track-next" callback={() => player.next()} sensitive={createBinding(player, "canGoNext")}/>
  </box>


const Position = (player: Mpris.Player) => {
  const formatSeconds = (s: number) => [3600, 60].reduceRight(
    (acc: (_: any) => any, step) => r => s > step ? [Math.floor(r / step)].concat(acc(r % step)) : acc(r),
    r => [r]
  )(Math.round(s))
    .map((n: number) => n.toString().padStart(2, "0"))
    .join(":")

  const position = createPoll(-1, 500, () => player.position)

  return <box class="position" orientation={Gtk.Orientation.VERTICAL}>
    <centerbox class="numeric">
      <label $type="start"
        halign={Gtk.Align.START} label={position.as(formatSeconds)}/>
      <label $type="end"
        halign={Gtk.Align.END} label={createBinding(player, "length").as(formatSeconds)}/>
    </centerbox>
    <slider
      class="highlightable"
      drawValue={false}
      value={position.as(p => p / player.length)}
      onChangeValue={({ value }) => player.set_position(value * player.length)}
    />
  </box>
}


const Player = (player: Mpris.Player) =>
  <box spacing={5}>
    <box>
      <With value={createBinding(player, "coverArt")}>
        {(file: string | null) => file
          ? <image class="cover" file={file}/>
          : <TablerIcon icon="music" size={120}/>
        }
      </With>
    </box>
    <box valign={Gtk.Align.CENTER} spacing={10} orientation={Gtk.Orientation.VERTICAL}>
      {Infos(player)}
      {Controls(player)}
      {Position(player)}
    </box>
  </box>


const MediaPopup = (props: PopupWindowProps) =>
  <PopupWindow
    class="media-popup"
    anchor={Astal.WindowAnchor.TOP}
    margin={10}
    {...props}>
    <box class="base player-list" spacing={15} orientation={Gtk.Orientation.VERTICAL}>
      <For each={createBinding(mpris, "players")}>
        {Player}
      </For>
    </box>
  </PopupWindow>


export default MediaPopup