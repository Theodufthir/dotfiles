import Button from "../common/components/button";
import NotifSvc from "gi://AstalNotifd";
import { createBinding, For } from "gnim";

const notifDaemon = NotifSvc.get_default()


const Notification = (notification: NotifSvc.Notification) =>
  <Button class="highlightable"
          onSecondaryClick={() => notification.dismiss()}>
    <box>
      {notification.summary}
    </box>
  </Button>


//<Gtk.Icon icon="preferences-system-notifications-symbolic"/>
const Notifications = () =>
  <box visible={createBinding(notifDaemon, "notifications").as(ntfs => ntfs.length > 0)}>
    <For each={createBinding(notifDaemon, "notifications")}>
      {Notification}
    </For>
  </box>


export default Notifications