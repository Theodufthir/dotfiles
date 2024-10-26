import { Popup, CustomButton } from "./popup.js"
import { TablerIcon } from "./tabler-icons.js"
import { getAudioDeviceName, getAudioDeviceIcon } from "./utils.js"

const audio = await Service.import("audio")

function Speaker(speaker) {
  const device = speaker.bind("stream").as(stream => audio.control.lookup_device_from_stream(stream))

  const indicator = Widget.Box({
    class_name: "indicator",
    children: [
      TablerIcon({ icon: device.as(getAudioDeviceIcon) }),
      Widget.Label({
        label: speaker.bind('volume').as(vol => (vol * 100).toFixed(0).toString() + "%")
      })
    ]
  })

  const name = CustomButton({
    class_name: "highlightable",
    child: Widget.Label({
      label: device.as(getAudioDeviceName),
      hexpand: true,
      hpack: "end"
    }),
    on_primary_click: device.as(dvc => () => audio.control.change_output(dvc)), // device shouldn't be null as it would be invisible
  })

  return Widget.Box({
    spacing: 10,
    children: [
      indicator,
      name
    ],
    visible: device.as(dvc => dvc != null && dvc['port-available'])
  })
}

function Speakers() {
  const speakers = audio.bind("speakers").as(spks => spks.map(Speaker).filter(s => s !== null))

  return Widget.Box({
    class_name: "speaker-list",
    vertical: true,
    children: speakers
  })
}

const audioNaming = (monitor) => 'audio-popup-' + monitor;

function AudioWindow(monitor = 0) {
  return Popup({
    name: audioNaming(monitor),
    monitor,
    class_name: "audio-popup",
    layer: "overlay",
    anchor: ["top", "right"],
    margins: [10, 10, 0, 0],
    child: Widget.Box({
      vertical: true,
      class_name: "base",
      children: [
        Widget.Label({ label: "Speakers" }),
        Speakers(),
      ]
    }),
  })
}

const Audio = {
  naming: audioNaming,
  Window: AudioWindow
}

export { Audio }
