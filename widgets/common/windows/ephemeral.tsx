import Astal from "gi://AstalIO";
import { timeout as createTimeout } from "astal/time"
import BaseWindow, { BaseWindowProps } from "./base";
import { type Connectable, type Subscribable } from "astal/binding"

export interface EphemeralWindowProps extends BaseWindowProps {
  timeout?: number
  trigger?: Subscribable | { connectable: Connectable, event: string }
  destroyOnTimeout?: boolean
}

const EphemeralWindow = ({ timeout = 1000, trigger, destroyOnTimeout = false, ...props }: EphemeralWindowProps) => {
  const window = <BaseWindow visible={trigger === undefined} {...props}/>

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

  const subscribable = trigger as Subscribable
  const { connectable, event } = trigger as { connectable: Connectable, event: string }
  subscribable?.subscribe(runTimeout)
  connectable?.connect(event, runTimeout)

  return window
}

export default EphemeralWindow