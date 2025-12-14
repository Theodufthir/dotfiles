import Mpris from "gi://AstalMpris";
import Pango from "gi://Pango";
import Button from "../common/components/button";
import MediaPopup from "./popups/media";
import { createBinding } from "gnim";
import { toggleOnCurrentMonitor } from "../../utils/monitors";
import { createReBinding, createMultiBinding } from "../../utils/variables";

const mpris = Mpris.get_default()

const Media = () => {
  const mainPlayer = createBinding(mpris, "players").as(ps => ps[0])
  const hasMedia = createReBinding(mainPlayer, "entry").as(e => e !== null && e !== undefined)
  const text = createMultiBinding(mainPlayer, ["title", "artist"], ({ title, artist }) => `${title} - ${artist}`)

  return <Button
    class={hasMedia.as(e => `media ${e ? "highlightable" : "no-media"}`)}
    sensitive={hasMedia}
    onPrimaryClick={() => toggleOnCurrentMonitor(MediaPopup)}
    onSecondaryClick={() => mainPlayer.peek().play_pause()}>
      <label label={text.as(t => t ?? "No media")}
             hasTooltip={hasMedia}
             tooltipText={text.as(t => t ?? "Unknown")}
             ellipsize={Pango.EllipsizeMode.MIDDLE}
             maxWidthChars={50}/>
  </Button>
}

export default Media
