import { TablerIcon } from "./tabler-icons.js"
import { Popup, CustomButton } from "./popup.js"

const mpris = await Service.import("mpris")
const hyprland = await Service.import("hyprland")

function Infos(player) {
  return Widget.Box({
    children: [
      Widget.Label({ label: player.bind("track-title") }),
      Widget.Label({ label: player.bind("track-artists").as(a => a.join(",")) }),
      Widget.Label({ label: player.bind("track-album") })
    ],
    vertical: true
  })
}

function Controls(player) {
  const control = (icon, callback, sensitive) => Widget.Button({
    child: TablerIcon({ icon }),
    on_clicked: callback,
    class_name: sensitive.as(s => s ? "highlightable" : "disabled"),
    sensitive,
  })

  const playPauseIcon = player.bind("play-back-status")
    .as(s => s === "Playing" ? "player-pause" : "player-play")

  const controls = [
    ["player-track-prev", player.previous, player.bind("can-go-prev")],
    ["rewind-backward-5", () => player.position = Math.max(player.position - 5, 0), player.bind("can-play")],
    [playPauseIcon, player.playPause, player.bind("can-play")],
    ["rewind-forward-5", () => player.position = Math.min(player.position + 5, player.length), player.bind("can-play")],
    ["player-track-next", player.next, player.bind("can-go-next")],
  ].map(cfg => control(...cfg));

  return Widget.Box({
    children: controls,
    homogeneous: true,
    class_name: "controls",
  })
}

function Position(player) {
  const formatSeconds = (s) => [3600, 60].reduceRight(
    (acc, step) => r => s > step ? [Math.floor(r / step)].concat(acc(r % step)) : acc(r),
    r => [r]
  )(Math.round(s))
    .map(n => n.toString().padStart(2, "0"))
    .join(":")

  const position = Variable(-1, { poll: [1000, () => player.position] })
  if (player.play_back_status !== "Playing") position.stopPoll()

  player.connect('changed', (player) => {
    const playing = player.play_back_status === "Playing"
    position.value = player.position
    if (position.isPolling && !playing)
      position.stopPoll()
    else if (!position.isPolling && playing)
      position.startPoll()
  })

  const length = player.bind("length").as(formatSeconds)
  const elapsed = position.bind().as(formatSeconds)

  const numeric = Widget.CenterBox({
    start_widget: Widget.Label({
      hpack: "start",
      label: elapsed
    }),
    end_widget: Widget.Label({
      hpack: "end",
      label: length
    }),
    class_name: "numeric"
  })

  const slider = Widget.Slider({
    value: position.bind().as(p => p / player.length),
    on_change: ({ value }) => player.position = value * player.length,
    draw_value: false,
    class_name: "highlightable"
  })

  return Widget.Box({
    children: [numeric, slider],
    vertical: true,
    class_name: "position"
  })
}

function Player(player) {
  const image = Widget.Icon({
    icon: player.bind("cover-path").as(c => c ?? "tablericons-music-symbolic"),
    class_name: "cover",
    size: 120,
  })

  const sidePanel = Widget.Box({
    vertical: true,
    spacing: 10,
    vpack: "center",
    children: [Infos, Controls, Position].map(fct => fct(player))
  })

  return Widget.Box({
    spacing: 5,
    children: [image, sidePanel]
  })
}

function Players(monitor) {
  return Widget.Box({
    class_name: "base player-list",
    vertical: true,
    spacing: 15,
    children: mpris.bind("players").as(ps => ps.map(Player))
  })
}

const mediaNaming = (monitor) => 'media-popup-' + monitor;

function MediaWindow(monitor = 0) {
  return Popup({
    name: mediaNaming(monitor),
    class_name: "media-popup",
    monitor,
    layer: "overlay",
    anchor: ["top"],
    margins: [10, 0, 0, 0],
    child: Players(monitor),
  })
}

const Media = {
  naming: mediaNaming,
  Window: MediaWindow
}

export {
  Media
}
