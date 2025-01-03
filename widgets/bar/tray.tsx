import TraySvc from "gi://AstalTray"
import { nBind } from "../../utils/variables";

const tray = TraySvc.get_default()

const Tray = () => <box>
  {nBind(tray, "items").as(items => items.map(item =>
    <menubutton
      tooltipMarkup={nBind(item, "tooltipMarkup")}
      usePopover={false}
      actionGroup={nBind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
      menuModel={nBind(item, "menuModel")}>
      <icon gicon={nBind(item, "gicon")} />
    </menubutton>
    ))
  }
</box>

export default Tray