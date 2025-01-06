import Net from "gi://AstalNetwork";
import WpSvc from "gi://AstalWp";
import BatterySvc from "gi://AstalBattery";
import BluetoothSvc from "gi://AstalBluetooth";
import BrightnessSvc from "../../services/brightness.js"
import PowerProfilesSvc from "gi://AstalPowerProfiles";
import Button from "../common/components/button";
import HoverRevealer from "../common/components/hover_revealer";
import AudioPopup from "./popups/audio";
import NetworkPopup from "./popups/network";
import BluetoothPopup from "./popups/bluetooth";
import { Gtk } from "astal/gtk3"
import { Variable } from "astal"
import { nDerive, nBind } from "../../utils/variables";
import { toggleOnCurrentMonitor } from "../../utils/monitors";
import TablerIcon, { TablerIconName } from "../common/components/tabler_icon";

const wp = WpSvc.get_default()
const battery = BatterySvc.get_default()
const bluetooth = BluetoothSvc.get_default()
const brightness = BrightnessSvc.get_default()
const network = Net.get_default()
const powerProfiles = PowerProfilesSvc.get_default()


const date = Variable("").poll(1000, 'date "+%H:%M"')
const Time = () => <>{nBind(date)}</>


const Bluetooth = () => {
  const icon = nDerive(bluetooth, ["isConnected", "isPowered"], ({ isConnected, isPowered }) =>
    "bluetooth" + (!isPowered ? "-off" : isConnected ? "-connected" : "")
  )

  const tooltipText = nBind(bluetooth, "devices").as(devices => devices.length + " device(s) connected")

  return <Button
    className="highlightable"
    onPrimaryClick={() => toggleOnCurrentMonitor(BluetoothPopup)}
    onSecondaryClick={bluetooth.toggle}
    tooltipText={tooltipText}>
    <TablerIcon icon={nBind(icon)} onDestroy={() => icon.drop()}/>
  </Button>
}


const Network = () => {
  const icon = nDerive(network, ["primary", "wifi"], ({ primary, wifi }) => {
    if (primary === Net.Primary.WIFI) {
      if (wifi.internet === Net.Internet.CONNECTING) {
        return "refresh"
      } else if (wifi.internet === Net.Internet.DISCONNECTED) {
        return "wifi-off"
      } else if (wifi.strength < 75) {
        return "wifi-" + Math.floor(wifi.strength / 25) as TablerIconName
      } else {
        return "wifi"
      }
    } else if (primary === Net.Primary.WIRED) {
      return "network"
    } else {
      return "router-off"
    }
  })

  const tooltipText = nDerive(network, ["primary", "wifi"], ({ primary, wifi }) =>
    primary === Net.Primary.WIFI ? wifi.ssid : (primary === Net.Primary.WIRED ? "Ethernet" : "No connection")
  )

  return <Button
    className="highlightable"
    onPrimaryClick={() => toggleOnCurrentMonitor(NetworkPopup)}
    onSecondaryClick={() => network.get_wifi()?.set_enabled(!network.get_wifi()?.enabled)}
    tooltipText={nBind(tooltipText)}
    onDestroy={() => tooltipText.drop()}>
    <TablerIcon icon={nBind(icon)} onDestroy={() => icon.drop()}/>
  </Button>
}


const Brightness = () =>
  <HoverRevealer
    transitionDuration={400}
    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}>
    <TablerIcon icon={nBind(brightness, "screen").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : ""))}/>
    <slider
      drawValue={false}
      className="slider highlightable"
      value={nBind(brightness, "screen")}
      // TODO onChange
    />
  </HoverRevealer>


function Volume() {
  const audio = wp?.get_audio()
  if (!audio) return null

  const icon = nDerive(audio.defaultSpeaker, ["mute", "volume"], ({mute, volume}) =>
    "volume" + (mute ? "-off" : (!volume ? "-3" : (volume < 0.5 ? "-2" : ""))))

  const tooltipText = nBind(audio.defaultSpeaker, "description")

  return <HoverRevealer
    transitionDuration={400}
    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}>
    <Button
      className="highlightable"
      onPrimaryClick={() => toggleOnCurrentMonitor(AudioPopup)}
      onSecondaryClick={() => audio?.get_default_speaker()?.set_mute(!audio?.get_default_speaker()?.mute)}
      tooltipText={tooltipText}>
      <TablerIcon icon={nBind(icon)} onDestroy={() => icon.drop()}/>
    </Button>
    <slider
      drawValue={false}
      className="slider highlightable"
      value={nBind(audio.defaultSpeaker, "volume")}
      // TODO onChange
    />
  </HoverRevealer>
}


function Battery() {
  function switchProfiles() {
    const profiles = powerProfiles.get_profiles()
    const activeIndex = profiles.findIndex(e => e.profile === powerProfiles.get_active_profile())
    const nextIndex = (activeIndex + 1) % profiles.length
    powerProfiles.activeProfile = profiles[nextIndex].profile
  }

  const hovered = Variable(false)

  const modeIcon = nBind(powerProfiles, "activeProfile").as(profile =>
    "battery-vertical" + { "power-saver": "-eco", "performance": "-exclamation", "balanced": "" }[profile]
  )

  const overlayIcon = Variable.derive([nBind(battery, "charging"), nBind(hovered), modeIcon],
    (charging, hovered, modeIcon) => (!hovered && charging) ? "battery-vertical-charging-2" : modeIcon
  )

  const tooltipText = nDerive(battery, ["percentage", "timeToEmpty"], ({ percentage, timeToEmpty }) =>
    `${percentage * 100}% : ` + (timeToEmpty > 3600 ? `${(timeToEmpty/3600).toFixed(1)}h` : `${(timeToEmpty/60).toFixed(0)}m`))

  return <Button
    className="battery highlightable"
    visible={nBind(battery, "isPresent")}
    onSecondaryClick={switchProfiles}
    onHover={() => hovered.set(true)}
    onHoverLost={() => hovered.set(false)}
    tooltip_text={nBind(tooltipText)}
    onDestroy={() => tooltipText.drop()}>
    <overlay passThrough>
      <TablerIcon
        icon={nBind(battery, "percentage").as(p => `battery-vertical${p > 0.15 ? "-" + Math.round(p / 0.25) : ""}`)}
        className="bars"/>
      <TablerIcon icon="battery-vertical" className="in-between"/>
      <TablerIcon icon={nBind(overlayIcon)} onDestroy={() => overlayIcon.drop()}/>
    </overlay>
  </Button>
}


export {
  Battery,
  Bluetooth,
  Brightness,
  Volume,
  Time,
  Network
}
