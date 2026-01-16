import App from "ags/gtk4/app";
import Bar from "./widgets/bar";
import Launcher from "./widgets/launcher";
import AudioPopup from "./widgets/bar/popups/audio";
import PowerPopup from "./widgets/bar/popups/power";
import MediaPopup from "./widgets/bar/popups/media";
import NetworkPopup from "./widgets/bar/popups/network";
import BluetoothPopup from "./widgets/bar/popups/bluetooth";
import VolumeIndicator from "./widgets/indicators/volume";
import BrightnessIndicator from "./widgets/indicators/brightness";
import { reloadCss } from "./utils/style";
import { monitorFile } from "ags/file";
import { registerMultiWorkspace, toggleOnCurrentMonitor } from "./utils/monitors";

function start() {
  App.add_icons(`${SRC}/assets/icons`)
  monitorFile(`${SRC}/style`, reloadCss)
  monitorFile(`${SRC}/style.scss`, reloadCss)
  reloadCss()

  void [
    Launcher,
    Bar,
    MediaPopup,
    AudioPopup, BluetoothPopup, NetworkPopup, PowerPopup,
    BrightnessIndicator, VolumeIndicator
  ].map(generator => registerMultiWorkspace(generator))
}

App.start({
  instanceName: "bar",
  main(...argv) {
    const command = argv ? argv[0] : undefined
    switch (command) {
      case undefined:
      case "start":
      case "run":
        start()
        break
      case "quit":
      case "stop":
      case "toggle":
      case "launcher":
        console.log(`Instance not running: "${command}" unavailable`)
        App.quit()
        break
      default:
        console.log(`Unknown command: "${command}"`)
        App.quit()
    }
  },
  requestHandler(argv: string[], res: (response: any) => void) {
    console.log(`Handling: "${argv.join(" ")}"`)
    const command = argv[0]
    switch (command) {
      case "quit":
      case "stop":
        res("Stopping instance...")
        App.quit();
        return
      case "toggle":
        if (argv.length < 2 || !App.get_window(argv[1]))
          return res("Error: window not found")
        App.toggle_window(argv[1])
        break
      case "launcher":
        toggleOnCurrentMonitor(Launcher)
        break
      default:
        res(`Unknown command: "${command}"`)
        return
    }
    res("ok")
  },
})