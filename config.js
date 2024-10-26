import { Bar } from "./widgets/bar.js"
import { Audio } from "./widgets/audio.js"
import { Media } from "./widgets/media.js"
import { Network } from "./widgets/network.js"
import { Bluetooth } from "./widgets/bluetooth.js"
import { VolumeFloatingIndicator as VolumeFI, BrightnessFloatingIndicator as BrightnessFI } from "./widgets/floating-indicators.js"

import brightness from "./services/brightness.js"
const hyprland = await Service.import("hyprland")
const audio = await Service.import("audio")

const registerable = [Bar, Audio, Media, Network, Bluetooth, VolumeFI, BrightnessFI]
let timers = {
  setupInhibit: setTimeout(_ => null, 500)
}

function AddMissingWindows(monitors) {
  const currentNames = App.windows.map(w => w.name)
  monitors.forEach(({id}) => registerable
    .filter(type => !currentNames.includes(type.naming(id)))
    .forEach(type => App.addWindow(type.Window(id))))
}

function RemoveUnusedWindows(monitors) {
  const toKeepNames = monitors
    .reduce((acc, {id}) => [...acc, ...registerable.map(type => type.naming(id))], [])
  App.windows
    .filter(({name}) => !toKeepNames.includes(name))
    .forEach(window => App.removeWindow(window))
}

function ReloadCss() {
  const scss = `${App.configDir}/style.scss`
  const css = `/tmp/ags-style.css`
  Utils.exec(`sassc -t compressed ${scss} ${css}`)
  App.resetCss()
  App.applyCss(css)
}

function setupFloatingIndicators() {
  const showFloatingIndicator = (naming, timeout = 1000) => {
    if (!timers.setupInhibit.is_destroyed()) return
    const common = naming(0)
    const toOpen = hyprland.monitors.map(({id}) => naming(id))
    toOpen.forEach(name => App.openWindow(name))
    timers[common]?.destroy()
    timers[common] = setTimeout(() => toOpen.forEach(name => App.closeWindow(name)), timeout)
  }

  Utils.merge(["volume", "is-muted", "name"].map(p => audio.speaker.bind(p)), (volume, isMuted, name) => showFloatingIndicator(VolumeFI.naming))
  Utils.watch({}, brightness, () => showFloatingIndicator(BrightnessFI.naming))
}

function setupBars() {
  hyprland.connect('event', ({ active, clients }, name) => {
    if (!["fullscreen", "workspace", "activewindow"].includes(name)) return
    const windowName = Bar.naming(active.monitor.id)
    const window = App.getWindow(windowName)
    const isFullscreen = active.client.class !== "firefox" && clients.find(c => c.address === active.client.address)?.fullscreen > 1
    window.attribute = isFullscreen ? "autohide" : null
  })
}

App.addIcons(`${App.configDir}/assets/icons`)
Utils.monitorFile(`${App.configDir}/style`, () => ReloadCss())
Utils.monitorFile(`${App.configDir}/style.scss`, () => ReloadCss())
hyprland.connect('monitor-removed', ({monitors}) => RemoveUnusedWindows(monitors))
hyprland.connect('monitor-added', ({monitors}) => AddMissingWindows(monitors))

ReloadCss()
AddMissingWindows(hyprland.monitors)
setupFloatingIndicators()
setupBars()

