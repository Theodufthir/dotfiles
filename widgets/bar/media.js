import { TablerIcon } from "../tabler-icons.js"
import { Media as MediaPopup } from "../media.js"

const mpris = await Service.import("mpris")

function Media(monitor) {
  function getTitle() {
    const players = mpris.players
    if (players.length > 0 && players[0].entry !== null) {
      const { track_artists, track_title } = players[0]
      return `${track_title} - ${track_artists.join(", ")}`
    } else {
      return "No media"
    }
  }

  const label = Utils.watch(getTitle(), mpris.players, getTitle)
  const showControls = label.as(str => str !== "No media")

  return Widget.Button({
    class_name: showControls.as(show => `media ${show ? "highlightable" : "no-media"}`),
    active: showControls,
    on_primary_click: () => App.openWindow(MediaPopup.naming(monitor)),
    on_secondary_click: () => mpris.getPlayer("")?.playPause(),
    child: Widget.Label({ label }),
  })
}

export {
  Media
}
