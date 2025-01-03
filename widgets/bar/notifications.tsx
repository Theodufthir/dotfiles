import Button from "../common/components/button";
import NotifSvc from "gi://AstalNotifd"
import { nBind } from "../../utils/variables";

const notifDaemon = NotifSvc.get_default()


const Notification = (notification: NotifSvc.Notification) =>
  <Button className="highlightable"
          onSecondaryClick={() => notification.dismiss()}>
    <box>
      {notification.summary}
    </box>
  </Button>


const Notifications = () =>
  <box visible={nBind(notifDaemon, "notifications").as(ntfs => ntfs.length > 0)}>
    <icon icon="preferences-system-notifications-symbolic"/>
    <box spacing={5}>
      {nBind(notifDaemon, "notifications").as(ntfs => ntfs.map(Notification))}
    </box>
  </box>


export default Notifications