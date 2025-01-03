import Brightness from "../../services/brightness";
import TablerIcon from "../common/components/tabler_icon";
import EphemeralWindow, {EphemeralWindowProps} from "../common/windows/ephemeral";
import { nBind } from "../../utils/variables"
import { Astal } from "astal/gtk3"

const brightness = Brightness.get_default()

const BrightnessIndicator = (props: EphemeralWindowProps) => <EphemeralWindow
  name="BrightnessIndicator"
  trigger={nBind(brightness, "screen")}
  anchor={Astal.WindowAnchor.BOTTOM}
  layer={Astal.Layer.OVERLAY}
  margin_bottom={100}
  {...props}>
  <box className="base floating-indicator brightness" spacing={3}>
    <TablerIcon icon={nBind(brightness, "screen").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : ""))}/>
    <slider className="bar-metric"
            hexpand
            draw_value={false}
            value={nBind(brightness, "screen")}/>
  </box>
</EphemeralWindow>

export default BrightnessIndicator