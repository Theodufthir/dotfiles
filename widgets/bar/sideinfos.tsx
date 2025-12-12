import Gtk from "gi://Gtk";
import Net from "gi://AstalNetwork";
import WpSvc from "gi://AstalWp";
import BatterySvc from "gi://AstalBattery";
import BluetoothSvc from "gi://AstalBluetooth";
import BrightnessSvc from "../../services/brightness.js";
import PowerProfilesSvc from "gi://AstalPowerProfiles";
import Button from "../common/components/button";
import HoverRevealer from "../common/components/hover_revealer";
import PowerPopup from "./popups/power";
import AudioPopup from "./popups/audio";
import NetworkPopup from "./popups/network";
import BluetoothPopup from "./popups/bluetooth";
import { suspend } from "../../utils/power";
import { createPoll } from "ags/time";
import { createMultiBinding } from "../../utils/variables";
import { toggleOnCurrentMonitor } from "../../utils/monitors";
import TablerIcon, { TablerIconName } from "../common/components/tabler_icon";
import { createBinding, createComputed, createState } from "gnim";

const wp = WpSvc.get_default()
const battery = BatterySvc.get_default()
const bluetooth = BluetoothSvc.get_default()
const brightness = BrightnessSvc.get_default()
const network = Net.get_default()
const powerProfiles = PowerProfilesSvc.get_default()


const Time = () => <label label={createPoll("", 100, 'date "+%H:%M"')}/>


const Bluetooth = () => {
  const icon = createMultiBinding(bluetooth, ["isConnected", "isPowered"], ({ isConnected, isPowered }) =>
    "bluetooth" + (!isPowered ? "-off" : isConnected ? "-connected" : "")
  )

  const tooltipText = createBinding(bluetooth, "devices").as(devices => devices.length + " device(s) detected")

  return <Button
    class="highlightable"
    onPrimaryClick={() => toggleOnCurrentMonitor(BluetoothPopup)}
    onSecondaryClick={() => bluetooth.toggle()}
    tooltipText={tooltipText}>
    <TablerIcon icon={icon}/>
  </Button>
}


const Network = () => {
  const icon = createComputed([
    createBinding(network, "primary"),
    createBinding(network, "wifi", "internet"),
    createBinding(network, "wifi", "strength"),
    createBinding(network, "wifi", "enabled")
  ], (primary, status, strength, enabled) => {
    if (primary === Net.Primary.WIRED) {
      return "network"
    } else if (primary === Net.Primary.WIFI || enabled) {
      if (status === Net.Internet.CONNECTING) {
        return "refresh"
      } else if (status === Net.Internet.DISCONNECTED) {
        return "wifi-off"
      } else if (strength < 75) {
        return "wifi-" + Math.floor(strength / 25) as TablerIconName
      } else {
        return "wifi"
      }
    } else {
      return "router-off"
    }
  })

  const tooltipText = createMultiBinding(network, ["primary", "wifi"], ({ primary, wifi }) =>
    primary === Net.Primary.WIFI ? wifi.ssid : (primary === Net.Primary.WIRED ? "Ethernet" : "No connection")
  )

  return <Button
    class="highlightable"
    onPrimaryClick={() => toggleOnCurrentMonitor(NetworkPopup)}
    onSecondaryClick={() => network.get_wifi()?.set_enabled(!network.get_wifi()?.enabled)}
    tooltipText={tooltipText}>
    <TablerIcon icon={icon}/>
  </Button>
}


const Brightness = () => {
  if (!brightness)
    return null

  return <HoverRevealer
      transitionDuration={400}
      transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}>
    <TablerIcon icon={createBinding(brightness, "screen").as(b => "sun" + (b < 0.2 ? "-low" : b > 0.8 ? "-high" : ""))}/>
    <slider
        drawValue={false}
        class="slider highlightable"
        value={createBinding(brightness, "screen")}
        // TODO onChange
    />
  </HoverRevealer>
}


const Volume = () => {
  const audio = wp?.get_audio()
  if (!audio) return null

  const icon = createMultiBinding(audio.defaultSpeaker, ["mute", "volume"], ({mute, volume}) =>
    "volume" + (mute ? "-off" : (!volume ? "-3" : (volume < 0.5 ? "-2" : ""))))

  const tooltipText = createBinding(audio.defaultSpeaker, "description")

  return <HoverRevealer
    transitionDuration={400}
    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}>
    <Button
      class="highlightable"
      onPrimaryClick={() => toggleOnCurrentMonitor(AudioPopup)}
      onSecondaryClick={() => audio?.get_default_speaker()?.set_mute(!audio?.get_default_speaker()?.mute)}
      tooltipText={tooltipText}>
      <TablerIcon icon={icon}/>
    </Button>
    <slider
      drawValue={false}
      class="slider highlightable"
      value={createBinding(audio.defaultSpeaker, "volume")}
      // TODO onChange
    />
  </HoverRevealer>
}


const Battery = () => {
  if (!battery.is_present)
    return null

  function switchProfiles() {
    const profiles = powerProfiles.get_profiles()
    const activeIndex = profiles.findIndex(e => e.profile === powerProfiles.get_active_profile())
    const nextIndex = (activeIndex + 1) % profiles.length
    powerProfiles.activeProfile = profiles[nextIndex].profile
  }

  const [hovered, setHovered] = createState(false)

  const modeIcon = createBinding(powerProfiles, "activeProfile").as(profile =>
    "battery-vertical" + { "power-saver": "-eco", "performance": "-exclamation", "balanced": "" }[profile]
  )

  const isCharging = createBinding(battery, "charging")

  const overlayIcon = createComputed(get =>
    (!get(hovered) && get(isCharging)) ? "battery-vertical-charging-2" : get(modeIcon)
  )

  const tooltipText = createMultiBinding(battery, ["percentage", "timeToEmpty"], ({ percentage, timeToEmpty }) =>
    `${percentage * 100}% : ` + (timeToEmpty > 3600 ? `${(timeToEmpty/3600).toFixed(1)}h` : `${(timeToEmpty/60).toFixed(0)}m`))

  const motionHandler = new Gtk.EventControllerMotion()

  const connectionEnterId = motionHandler.connect("enter", () => setHovered(true))
  const connectionLeaveId = motionHandler.connect("leave", () => setHovered(false))

  return <Button
    $={self => self.add_controller(motionHandler)}
    onDestroy={() => {
      motionHandler.disconnect(connectionEnterId)
      motionHandler.disconnect(connectionLeaveId)
    }}
    class="battery highlightable"
    onSecondaryClick={switchProfiles}
    tooltip_text={tooltipText}>
    <overlay>
      <TablerIcon
        icon={createBinding(battery, "percentage").as(p => `battery-vertical${p > 0.15 ? "-" + Math.round(p / 0.25) : ""}`)}
        class="bars"/>
      <TablerIcon $type="overlay" icon="battery-vertical" class="in-between"/>
      <TablerIcon $type="overlay" icon={overlayIcon}/>
    </overlay>
  </Button>
}


const Power = () => (
    <Button
      class="highlightable"
      onPrimaryClick={() => toggleOnCurrentMonitor(PowerPopup)}
      onSecondaryClick={() => suspend()}>
    <TablerIcon icon="power"/>
  </Button>
)


export {
  Power,
  Battery,
  Bluetooth,
  Brightness,
  Volume,
  Time,
  Network
}
