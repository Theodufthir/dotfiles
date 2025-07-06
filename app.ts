import Bar from "./widgets/bar"
import PowerPopup from "./widgets/bar/popups/power";
import AudioPopup from "./widgets/bar/popups/audio";
import MediaPopup from "./widgets/bar/popups/media";
import NetworkPopup from "./widgets/bar/popups/network";
import BluetoothPopup from "./widgets/bar/popups/bluetooth";
import VolumeIndicator from "./widgets/indicators/volume";
import BrightnessIndicator from "./widgets/indicators/brightness";
import { App } from "astal/gtk3"
import { reloadCss } from "./utils/style";
import { monitorFile } from "astal/file"
import { registerMultiWorkspace } from "./utils/monitors";


App.start({
    instanceName: "bar",
    main: () => {
        [
          Bar,
          BrightnessIndicator, VolumeIndicator,
          AudioPopup, MediaPopup, NetworkPopup, BluetoothPopup, PowerPopup
        ].forEach(registerMultiWorkspace)

        App.add_icons(`${SRC}/assets/icons`)
        monitorFile(`${SRC}/style`, reloadCss)
        monitorFile(`${SRC}/style.scss`, reloadCss)
        reloadCss()
    },
    client: (sendRequest, ...args) => {
        if (args[0] === "quit") sendRequest("quit")
    },
    requestHandler: (request, res) => {
        const args = request.split(" ")
        if (args.length < 1) return

        if (args[0] === "hide_popup" && args[1]) {
            const window = App.get_window(args[1])
            if (window && !window.get_accept_focus()) window.hide()
            res("ok")
        } else if (args[0] === "quit") {
            App.quit()
            res("ok")
        }
    }
})
