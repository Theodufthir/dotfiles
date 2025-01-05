import Mpris from "gi://AstalMpris"
import Button from "../common/components/button";
import MediaPopup from "./popups/media";
import { nBind, nDerive } from "../../utils/variables";
import { toggleOnCurrentMonitor } from "../../utils/monitors";

const mpris = Mpris.get_default()

function Media() {
  const mainPlayer = nBind(mpris, "players").as(ps => ps[0])
  const hasMedia = nBind(mainPlayer, "entry").as(e => e !== null)
  const text = nDerive(mainPlayer, ["entry", "title", "artist"],
    ({ entry, title, artist }) => entry ? `${title} - ${artist}` : "No media"
  )

  return <Button
    className={hasMedia.as(e => `media ${e !== null ? "highlightable" : "no-media"}`)}
    sensitive={hasMedia}
    onPrimaryClick={() => toggleOnCurrentMonitor(MediaPopup)}
    onSecondaryClick={() => mainPlayer.get().play_pause()}
    onDestroy={() => text.drop()}>
    {nBind(text)}
  </Button>
}

export default Media
