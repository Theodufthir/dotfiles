import TraySvc from "gi://AstalTray";
import { createBinding, For } from "gnim";

const tray = TraySvc.get_default()


const Tray = () => <box>
  <For each={createBinding(tray, "items")}>
    {(item: TraySvc.TrayItem) =>
      (<menubutton
        $={self => {
          self.insert_action_group("dbusmenu", item.actionGroup)
          self.get_popover()?.set_has_arrow(false) //purely visual but can't unallocate space via CSS :(
        }}
        tooltipMarkup={createBinding(item, "tooltipMarkup")}
        menuModel={createBinding(item, "menuModel")}
      >
        <image gicon={createBinding(item, "gicon")}/>
      </menubutton>)
    }
  </For>
</box>


export default Tray