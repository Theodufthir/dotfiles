import Button from "../../common/components/button";
import Bluetooth from "gi://AstalBluetooth"
import TablerIcon from "../../common/components/tabler_icon";
import { nBind } from "../../../utils/variables";
import { Astal, Gtk } from "astal/gtk3"
import { FilteredSections } from "../../common/components/filter_sections";
import PopupWindow, { PopupWindowProps } from "../../common/windows/popup";

const bluetooth = Bluetooth.get_default()


const Device = (device: Bluetooth.Device) =>
  <box spacing={10}>
    <box className="indicator">
      <TablerIcon icon={nBind(device, "icon").as(i => i?.split("-").pop() ?? "bluetooth")}/>
    </box>
    <Button
      className="highlightable"
      hexpand
      halign={Gtk.Align.END}
      onPrimaryClick={() => {
        if (!device.paired)
          device.pair()
        else if (!device.connected)
          device.connect_device(null)
        else if (!device.connecting)
          device.disconnect_device(null)
      }}>
      {nBind(device, "alias").as(alias => alias ?? device.address)}
    </Button>
  </box>


const BluetoothPopup = (props: PopupWindowProps) =>
  <PopupWindow
    className="bluetooth-popup"
    layer={Astal.Layer.OVERLAY}
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    margin={10}
    {...props}>
    <FilteredSections
      className="base"
      source={nBind(bluetooth, "devices")}
      template={Device}
      triggers={["connected", "paired"]}
      spacing={4}
      vertical
      sections={[
        {
          filter: (d: Bluetooth.Device) => d.connected,
          adds: [<label label="Connected"/>]
        },
        {
          filter: (d: Bluetooth.Device) => d.paired,
          adds: [<label label="Paired"/>]
        },
        {
          filter: (_: any) => true,
          adds: [<label label="Detected"/>]
        }
      ].map(props => ({
        ...props,
        hideIfEmpty: true,
        props: { vertical: true, className: "device-list" }
      }))}
    />
  </PopupWindow>


export default BluetoothPopup
