import Astal from "gi://AstalIO";
import { timeout as createTimeout } from "astal/time"
import BaseWindow, { BaseWindowProps } from "./base";
import { type Connectable, type Subscribable } from "astal/binding"

export interface EphemeralWindowProps extends BaseWindowProps {
  timeout?: number
  trigger?: Subscribable | { connectable: Connectable, event: string }
  destroyOnTimeout?: boolean
}

const EphemeralWindow = ({ timeout = 1000, trigger, onDestroy = undefined, destroyOnTimeout = false, ...props }: EphemeralWindowProps) => {
  let releaseCallback: () => void
  const window = <BaseWindow
    visible={trigger === undefined}
    onDestroy={self => {
      if (onDestroy !== undefined) onDestroy(self)
      releaseCallback()
    }}
    {...props}
  />

  if (trigger === undefined) {
    createTimeout(timeout, destroyOnTimeout ? window.destroy : window.hide)
    return window
  }

  let timer: (Astal.Time | undefined)
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

  if (typeof trigger["event"] === "string") {
    const { connectable, event } = trigger as { connectable: Connectable, event: string }
    const id = connectable.connect(event, runTimeout)
    releaseCallback = () => connectable.disconnect(id)
  } else {
    const subscribable = trigger as Subscribable
    releaseCallback = subscribable.subscribe(runTimeout)
  }

  return window
}

export default EphemeralWindow