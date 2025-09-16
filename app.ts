import App from "ags/gtk4/app";
import Bar from "./widgets/bar";
import AudioPopup from "./widgets/bar/popups/audio";
import PowerPopup from "./widgets/bar/popups/power";
import MediaPopup from "./widgets/bar/popups/media";
import NetworkPopup from "./widgets/bar/popups/network";
import BluetoothPopup from "./widgets/bar/popups/bluetooth";
import VolumeIndicator from "./widgets/indicators/volume";
import BrightnessIndicator from "./widgets/indicators/brightness";
import { reloadCss } from "./utils/style";
import { monitorFile } from "ags/file";
import { registerMultiWorkspace } from "./utils/monitors";

App.start({
  instanceName: "bar",
  main(...argv) {
    [
      Bar,
      MediaPopup,
      AudioPopup, BluetoothPopup, NetworkPopup, PowerPopup,
      BrightnessIndicator, VolumeIndicator
    ].map(generator => registerMultiWorkspace(generator))

    App.add_icons(`${SRC}/assets/icons`)
    monitorFile(`${SRC}/style`, reloadCss)
    monitorFile(`${SRC}/style.scss`, reloadCss)
    reloadCss()
  }
})