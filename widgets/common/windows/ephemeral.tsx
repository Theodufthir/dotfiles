import Astal from "gi://Astal?version=4.0";
import { Accessor } from "gnim";
import BaseWindow, { BaseWindowProps } from "./base";
import { timeout as createTimeout, Timer } from "ags/time";

export interface EphemeralWindowProps extends BaseWindowProps {
  timeout?: number
  trigger?: Accessor
  destroyOnTimeout?: boolean
}

const EphemeralWindow = ({ timeout = 1000, trigger, onDestroy = undefined, destroyOnTimeout = false, ...props }: EphemeralWindowProps) => {
  let releaseCallback: () => void
  let window: Astal.Window
  const window_object = <BaseWindow
    $={self => window = self}
    visible={trigger === undefined}
    onDestroy={self => {
      if (onDestroy !== undefined) onDestroy(self)
      releaseCallback()
    }}
    {...props}
  />

  if (trigger === undefined) {
    createTimeout(timeout, destroyOnTimeout ? window!.destroy : window!.hide)
    return window_object
  }

  let timer: (Timer | undefined)
  let windowDestroyed = false
  const runTimeout = () => {
    timer?.cancel()
    if (windowDestroyed) return
    window.show()
    timer = createTimeout(timeout, () => {
      window.hide()
      if (destroyOnTimeout) {
        windowDestroyed = true
        window.destroy()
      }
    })
  }

  releaseCallback = trigger.subscribe(runTimeout)

  return window_object
}

export default EphemeralWindow