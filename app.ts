import Bar from "./widgets/bar"
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
          AudioPopup, MediaPopup, NetworkPopup, BluetoothPopup
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

/*
function setupBars() {
    hyprland.connect('event', ({ active, clients }: , name) => {
        if (!["fullscreen", "workspace", "activewindow"].includes(name)) return
        const windowName = Index.naming(active.monitor.id)
        const window = App.get_window(windowName)
        const isFullscreen = active.client.class !== "firefox" && clients.find(c => c.address === active.client.address)?.fullscreen > 1
        window.attribute = isFullscreen ? "autohide" : null
    })
}
setupBars()
*/
