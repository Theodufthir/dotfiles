import { exec, execAsync } from "ags/process";
import { monitorFile, readFileAsync } from "ags/file";
import GObject, { register, getter } from "gnim/gobject";

const get = (args: string) => Number(exec(`brightnessctl ${args}`))
const screen = exec(`sh -c "ls -w1 /sys/class/backlight | head -1"`)
const kbd = exec(`sh -c 'ls -w1 /sys/class/leds | grep "kbd" | head -1'`)

@register({ GTypeName: "Brightness" })
export default class Brightness extends GObject.Object {
  static instance: Brightness | null

  static get_default() {
    if (this.instance == undefined)
      this.instance = screen || kbd ? new Brightness() : null
    return this.instance
  }

  #kbdMax = 0
  #kbd = 0

  #screenMax = 0
  #screenExponent = 0
  #screenWeight = 0
  #screen = 0

  @getter(Number)
  get kbd() { return this.#kbd }

  set kbd(value) {
    if (value < 0 || value > this.#kbdMax) return

    execAsync(`brightnessctl -d ${kbd} s ${value} -q`)
  }

  @getter(Number)
  get screen() { return this.#screen }

  set screen(percent) {
    if (percent < 0) percent = 0
    if (percent > 1) percent = 1

    const weighted = 1 + (percent - 1) * this.#screenWeight
    const minus = this.#screen > percent

    execAsync(`brightnessctl --exponent=${this.#screenExponent} -s${minus ? "n" : ""} set ${weighted * 100}% -q`)
  }

  @getter(Number)
  get screenExponent() {
    return this.#screenExponent
  }

  set screenExponent(value) {
    this.#screenExponent = value
    this.#screenWeight = 1 - (1/this.#screenMax)**(1/this.#screenExponent)
  }

  constructor() {
    super()

    if (screen) {
      const screenPath = `/sys/class/backlight/${screen}/brightness`
      this.#screenMax = get("max")
      this.#screenExponent = 5
      this.#screenWeight = 1 - (1 / this.#screenMax) ** (1 / this.#screenExponent);
      this.#screen = get("get") / (get("max") || 1)

      const update = async (f: string) => {
        const v = await readFileAsync(f)
        const percent = (Number(v) / this.#screenMax) ** (1 / this.#screenExponent)
        this.#screen = 1 + (percent - 1) / this.#screenWeight
        this.notify("screen")
      }

      monitorFile(screenPath, update)
      update(screenPath)
    }

    if (kbd) {
      const kbdPath = `/sys/class/leds/${kbd}/brightness`
      this.#kbdMax = get(`--device ${kbd} max`)
      this.#kbd = get(`--device ${kbd} get`)

      // TODO fix this: doesn't work when changed without using "kbd" property setter
      monitorFile(kbdPath, async f => {
        const v = await readFileAsync(f)
        this.#kbd = Number(v)
        this.notify("kbd")
      })
    }
  }
}