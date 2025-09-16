import Astal from "gi://Astal?version=4.0";
import Brightness from "../../services/brightness";
import TablerIcon from "../common/components/tabler_icon";
import { createBinding } from "gnim";
import EphemeralWindow, { EphemeralWindowProps } from "../common/windows/ephemeral";

const brightness = Brightness.get_default()

const BrightnessIndicator = (props: EphemeralWindowProps) => {
  if (!brightness)
    return null

  return <EphemeralWindow
      name="BrightnessIndicator"
      trigger={createBinding(brightness, "screen")}
      anchor={Astal.WindowAnchor.BOTTOM}
      layer={Astal.Layer.OVERLAY}
      margin_bottom={100}
      {...props}>
    <box class="base floating-indicator brightness" spacing={3}>
      <TablerIcon icon={createBinding(brightness, "screen").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : ""))}/>
      <slider class="bar-metric"
              hexpand
              draw_value={false}
              value={createBinding(brightness, "screen")}/>
    </box>
  </EphemeralWindow>
}

export default BrightnessIndicator