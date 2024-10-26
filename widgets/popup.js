const hyprland = await Service.import("hyprland")

function checkHovered(widget) {
  if (widget.isHovered()) return true
  return widget.children?.some(checkHovered)
}

function CustomButton({ ...params }) {
  let popup = null
  return Widget.Button({ ...params })
  .on('enter-notify-event', (self) => {
    popup ??= self
    while (popup.parent !== null)
      popup = popup.parent
    popup.attribute = { ...popup.attribute, hovered: true }
  })
}

function Popup({ monitor, name, ...params }) {
  const bindScript = `const window = App.getWindow("${name}"); window.visible = window.attribute.hovered`
  const setHovered = (self, value) => self.attribute = { ...self.attribute, hovered: value } 

  return Widget.Window({
    monitor,
    name,
    visible: false,
    ...params,
    attribute: { ...params.attribute, hovered: false },
  })
  .on('show', (self) => {
    setHovered(self, false)
    hyprland.message(`keyword bindn , mouse:272, exec, ags -r '${bindScript}'`)
  })
  .on('hide', () => hyprland.messageAsync(`keyword unbind , mouse:272`))
  .on('leave-notify-event', (self) => setHovered(self, false))
  .on('enter-notify-event', (self) => setHovered(self, true))
}

export {
  Popup,
  CustomButton
}
