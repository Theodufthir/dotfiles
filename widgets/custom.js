function HoverRevealer({ displayed, revealed, lock_reveal = null, transition = "slide_left", transition_duration = 500, ...params }) {
  if (lock_reveal === null || typeof(lock_reveal) !== "object") {
    lock_reveal = Variable(lock_reveal)
  }

  const revealer = Widget.Revealer({
    reveal_child: lock_reveal.bind().as(value => value ?? false),
    transition,
    transition_duration,
    child: revealed
  })

  revealer.on('enter-notify-event', () => revealer.reveal_child = lock_reveal.value ?? true ) // To fix instant closing on eventbox

  const parent = Widget.Box({
    vertical: params.vertical ?? /slide_(up|down)/.test(transition),
    children: /slide_(right|up)/.test(transition)
      ? [revealer, displayed]
      : [displayed, revealer],
    ...params
  })

  return Widget.EventBox({
    on_hover: () => revealer.reveal_child = lock_reveal.value ?? true,
    on_hover_lost: () => revealer.reveal_child = lock_reveal.value ?? false,
    child: parent
  })
}

function HoverSwitcher({ displayed, revealed, transition = 'slide_left', transition_duration = 500, ...params }) {
  let transitionOut = {
    slide_left: "slide_right",
    slide_right: "slide_left",
    slide_up: "slide_down",
    slide_down: "slide_up"
  }[transition] ?? transition

  const revealer = Widget.Revealer({
    reveal_child: false,
    transition,
    transition_duration,
    child: revealed
  })

  const displayer = Widget.Revealer({
    reveal_child: true,
    transition: transitionOut,
    transition_duration,
    child: displayed
  })

  const parent = Widget.Box({
    vertical: params.vertical ?? /slide_(up|down)/.test(transition),
    children: /slide_(right|down)/.test(transition)
      ? [revealer, displayer]
      : [displayer, revealer],
    ...params
  })

  return Widget.EventBox({
    on_hover: () => {
      revealer.reveal_child = true
      displayer.reveal_child = false
    },
    on_hover_lost: () => {
      revealer.reveal_child = false
      displayer.reveal_child = true
    },
    child: parent
  })
}

function AutoStack({ items, timeout = 1000, transition = 'crossfade', transition_duration = 500, ...params }) {
  const keys = Object.keys(items)
  const length = keys.length

  let shownIdx = Variable(0)
  setInterval(() => shownIdx.setValue((shownIdx.value + 1) % length), timeout)

  return Widget.Stack({
    children: items,
    shown: shownIdx.bind().as(idx => keys[idx]),
    transition_duration,
    transition,
    ...params
  })
}

export {
  HoverRevealer,
  HoverSwitcher,
  AutoStack
}
