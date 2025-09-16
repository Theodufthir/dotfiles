import TraySvc from "gi://AstalTray";
import { createBinding, For } from "gnim";

const tray = TraySvc.get_default()

const Tray = () => <box>
  <For each={createBinding(tray, "items")}>
    {(item: TraySvc.TrayItem) =>
      (<menubutton
        tooltipMarkup={createBinding(item, "tooltipMarkup")}
        usePopover={false}
        actionGroup={createBinding(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={createBinding(item, "menuModel")}
      >
      </menubutton>)
    }
  </For>
</box>
//<icon gicon={createBinding(item, "gicon")} />

export default Tray