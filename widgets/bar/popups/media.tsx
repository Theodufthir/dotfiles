import Mpris from "gi://AstalMpris"
import Button from "../../common/components/button";
import TablerIcon from "../../common/components/tabler_icon";
import {nBind } from "../../../utils/variables";
import { Astal, Gtk } from "astal/gtk3"
import { Binding, Variable } from "astal"
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const mpris = Mpris.get_default()


const Infos = (player: Mpris.Player) =>
  <box vertical>
    <label truncate label={nBind(player, "title")}/>
    <label truncate label={nBind(player, "artist")}/>
    <label truncate label={nBind(player, "album")}/>
  </box>


interface ControlProps { icon: string | Binding<string>; callback: () => void; sensitive: Binding<boolean>; }

const Control = ({ sensitive, callback, icon }: ControlProps) =>
  <Button className={sensitive.as(s => s ? "highlightable" : "disabled")}
    onPrimaryClick={callback} sensitive={sensitive}>
    <TablerIcon icon={icon}/>
  </Button>


const Controls = (player: Mpris.Player) =>
  <box className="controls" homogeneous>
    <Control icon="player-track-prev" callback={() => player.previous()} sensitive={nBind(player, "canGoPrevious")}/>
    <Control icon="rewind-backward-5" sensitive={nBind(player, "canPlay")}
             callback={() => player.position = Math.max(player.position - 5, 0)}/>
    <Control callback={() => player.play_pause()} sensitive={nBind(player, "canPlay")}
             icon={nBind(player, "playbackStatus").as(s => `player-${s === Mpris.PlaybackStatus.PLAYING ? "pause" : "play"}`)}/>
    <Control icon="rewind-forward-5" sensitive={nBind(player, "canPlay")}
             callback={() => player.position = Math.min(player.position + 5, player.length)}/>
    <Control icon="player-track-next" callback={() => player.next()} sensitive={nBind(player, "canGoNext")}/>
  </box>


const Position = (player: Mpris.Player) => {
  const formatSeconds = (s: number) => [3600, 60].reduceRight(
    (acc: (_: any) => any, step) => r => s > step ? [Math.floor(r / step)].concat(acc(r % step)) : acc(r),
    r => [r]
  )(Math.round(s))
    .map((n: number) => n.toString().padStart(2, "0"))
    .join(":")

  const position = Variable(0).poll(500, () => player.position)
  const unsubscribe = nBind(player, "playbackStatus")
    .subscribe(s => s === Mpris.PlaybackStatus.PLAYING ? position.startPoll() : position.stopPoll())

  return <box className="position" vertical onDestroy={() => {
    position.drop()
    unsubscribe()
  }}>
    <centerbox className="numeric">
      <label halign={Gtk.Align.START} label={nBind(position).as(formatSeconds)}/>
      <box/>
      <label halign={Gtk.Align.END} label={nBind(player, "length").as(formatSeconds)}/>
    </centerbox>
    <slider
      className="highlightable"
      drawValue={false}
      value={nBind(position).as(p => p / player.length)}
      onDragged={({ value }) => player.set_position(value * player.length)}
    />
  </box>
}


const Player = (player: Mpris.Player) =>
  <box spacing={5}>
    <box className="cover"
         css={nBind(player, "coverArt").as(c => `background-image: url('${c}')`)}>
      <TablerIcon icon="music" size={120} visible={nBind(player, "coverArt").as(c => c === null)}/>
    </box>
    <box valign={Gtk.Align.CENTER} spacing={10} vertical>
      {Infos(player)}
      {Controls(player)}
      {Position(player)}
    </box>
  </box>


const MediaPopup = (props: PopupWindowProps) =>
  <PopupWindow
    className="media-popup"
    anchor={Astal.WindowAnchor.TOP}
    margin={10}
    {...props}>
    <box className="base player-list" spacing={15} vertical>
      {nBind(mpris, "players").as(ps => ps.map(Player))}
    </box>
  </PopupWindow>


export default MediaPopup