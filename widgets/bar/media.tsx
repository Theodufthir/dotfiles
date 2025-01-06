import Mpris from "gi://AstalMpris"
import Button from "../common/components/button";
import MediaPopup from "./popups/media";
import { nBind, nDerive } from "../../utils/variables";
import { toggleOnCurrentMonitor } from "../../utils/monitors";

const mpris = Mpris.get_default()

const Media = () => {
  const mainPlayer = nBind(mpris, "players").as(ps => ps[0])
  const hasMedia = nBind(mainPlayer, "entry").as(e => e !== null && e !== undefined)
  const text = nDerive(mainPlayer, ["title", "artist"], ({ title, artist }) => `${title} - ${artist}`)

  return <Button
    className={hasMedia.as(e => `media ${e ? "highlightable" : "no-media"}`)}
    sensitive={hasMedia}
    onPrimaryClick={() => toggleOnCurrentMonitor(MediaPopup)}
    onSecondaryClick={() => mainPlayer.get().play_pause()}
    onDestroy={() => text.drop()}>
    {nBind(text).as(t => t ?? "No media")}
  </Button>
}

export default Media
