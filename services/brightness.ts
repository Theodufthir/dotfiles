import { exec, execAsync } from "astal/process"
import { monitorFile, readFileAsync } from "astal/file"
import GObject, { register, property } from "astal/gobject"

const get = (args: string) => Number(exec(`brightnessctl ${args}`))
const screen = exec(`sh -c "ls -w1 /sys/class/backlight | head -1"`)
const kbd = exec(`sh -c 'ls -w1 /sys/class/leds | grep "kbd" | head -1'`)

@register({ GTypeName: "Brightness" })
export default class Brightness extends GObject.Object {
  static instance: Brightness

  static get_default() {
    if (!this.instance)
      this.instance = new Brightness()
    return this.instance
  }

  #kbdMax = get(`--device ${kbd} max`)
  #kbd = get(`--device ${kbd} get`)

  #screenMax = get("max")
  #screenExponent = 5
  #screenWeight = 1 - (1/this.#screenMax)**(1/this.#screenExponent);
  #screen = get("get") / (get("max") || 1)

  @property(Number)
  get kbd() { return this.#kbd }

  set kbd(value) {
    if (value < 0 || value > this.#kbdMax) return

    execAsync(`brightnessctl -d ${kbd} s ${value} -q`)
  }

  @property(Number)
  get screen() { return this.#screen }

  set screen(percent) {
    if (percent < 0) percent = 0
    if (percent > 1) percent = 1

    const weighted = 1 + (percent - 1) * this.#screenWeight
    const minus = this.#screen > percent

    execAsync(`brightnessctl --exponent=${this.#screenExponent} -s${minus ? "n" : ""} set ${weighted * 100}% -q`)
  }

  @property(Number)
  get screenExponent() {
    return this.#screenExponent
  }

  set screenExponent(value) {
    this.#screenExponent = value
    this.#screenWeight = 1 - (1/this.#screenMax)**(1/this.#screenExponent)
  }

  constructor() {
    super()

    const screenPath = `/sys/class/backlight/${screen}/brightness`
    const kbdPath = `/sys/class/leds/${kbd}/brightness`

    const update = async (f: string) => {
      const v = await readFileAsync(f)
      const percent = (Number(v)/this.#screenMax)**(1/this.#screenExponent)
      this.#screen = 1 + (percent - 1) / this.#screenWeight
      this.notify("screen")
    }

    monitorFile(screenPath, update)
    update(screenPath)

    // TODO fix this: doesn't work when changed without using "kbd" property setter
    monitorFile(kbdPath, async f => {
      const v = await readFileAsync(f)
      this.#kbd = Number(v)
      this.notify("kbd")
    })
  }
}