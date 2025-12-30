import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";
import AppsSvc from "gi://AstalApps"
import Button from "../common/components/button";
import Graphene from "gi://Graphene";
import { Astal } from "ags/gtk4";
import { createState, For } from "gnim";
import BaseWindow, { BaseWindowProps } from "../common/windows/base";


const Launcher = (props: BaseWindowProps) => {
  let win: Astal.Window
  let entry: Gtk.Entry
  let listBox: Gtk.ListBox
  let scroll: Gtk.ScrolledWindow

  const appsSvc = new AppsSvc.Apps()
  const [apps, setApps] = createState(appsSvc.list.toSorted((a, b) => b.frequency - a.frequency))
  const [selIndex, setSelIndex] = createState(0)
  let mouseLastSelect: number | undefined = 0
  let lastPos = Graphene.Point.zero()

  const selectRow = (idx: number, { difference = false, mouse = false } = {}) => {
    idx = difference ? (selIndex.peek() + idx + apps.peek().length) : idx
    idx %= apps.peek().length

    mouseLastSelect = undefined
    listBox.select_row(listBox.get_row_at_index(idx))
    setSelIndex(idx)

    const selectedRow = listBox.get_selected_row()
    const firstRow = listBox.get_row_at_index(0)
    if (!selectedRow || !firstRow) return

    const zero = Graphene.Point.zero()
    const [, fromScroll] = selectedRow.compute_point(scroll, zero)
    const [, fromFirst] = selectedRow.compute_point(firstRow, zero)

    const vScroll = fromScroll.y
    const vRow = fromFirst.y
    const scrollHeight = scroll.get_height()
    const rowHeight = selectedRow.get_height()
    const rowDiff = mouse ? 0 : rowHeight

    if (vScroll < rowDiff) {
      scroll.get_vadjustment().set_value(vRow - rowDiff)
      mouseLastSelect = mouse ? undefined : idx
    }
    else if ((vScroll + rowHeight + rowDiff) > scrollHeight) {
      scroll.get_vadjustment().set_value(vRow + rowHeight + rowDiff - scrollHeight)
      mouseLastSelect = mouse ? undefined : idx
    }
  }

  const search = (text: string) => {
    if (text)
      setApps(appsSvc.exact_query(text))
    else
      setApps(appsSvc.list.toSorted((a, b) => b.frequency - a.frequency))
    selectRow(0)
  }

  const keyPressed = (_event: Gtk.EventControllerKey, key: number, _: number, ) => {
    switch (key) {
      case Gdk.KEY_Escape:
        win.hide()
        break
      case Gdk.KEY_Up:
        selectRow(-1, { difference: true })
        break
      case Gdk.KEY_Tab:
      case Gdk.KEY_Down:
        selectRow(+1, { difference: true })
        break
      // TODO: Find a way to handle Return/Enter here instead of in entry
      default:
        return false
    }
    return true
  }

  const launch = (app?: AppsSvc.Application) => {
    if (app) {
      win.hide()
      app.launch()
    }
  }

  const clicked = (_event: Gtk.GestureClick, _: number, x: number, y: number) => {
    const [, rect] = win.compute_bounds(win)
    const position = new Graphene.Point({ x, y })

    if (!rect.contains_point(position)) {
      win.hide()
      return true
    }
  }

  return <BaseWindow
    name="launcher"
    $={self => win = self}
    class="base launcher"
    visible={false}
    exclusivity={Astal.Exclusivity.IGNORE}
    keymode={Astal.Keymode.EXCLUSIVE}
    onNotifyVisible={({ visible }) => {
      if (visible) {
        entry.grab_focus()
        entry.set_text("")
        entry.notify("text")
      }
    }}
    {...props}
  >
    <Gtk.EventControllerKey onKeyPressed={keyPressed}/>
    <Gtk.GestureClick onPressed={clicked}/>
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.EventControllerMotion propagationPhase={Gtk.PropagationPhase.CAPTURE} onMotion={(self, x, y) => {
        const pos = new Graphene.Point({ x, y })
        if (!pos.equal(lastPos) && mouseLastSelect != undefined)
          selectRow(mouseLastSelect, { mouse: true })
        lastPos = pos
      }}/>
      <entry
        $={self => entry = self}
        class="search"
        placeholderText="Search ..."
        onNotifyText={({ text }) => search(text)}
        onActivate={() => listBox.activate()}
      />
      <Gtk.Separator/>
      <Gtk.ScrolledWindow $={self => scroll = self}>
        <Gtk.ListBox
          $={self => listBox = self}
          class="apps"
          selectionMode={Gtk.SelectionMode.BROWSE}
          onActivateCursorRow={(self) => self.get_selected_row()?.activate()}
        >
          <For each={apps}>
            {(app, idx) => <Gtk.ListBoxRow class="app" onActivate={() => launch(app)}>
              <Button onPrimaryClick={() => listBox.activate()}>
                <Gtk.EventControllerMotion onEnter={() =>  {
                  if (mouseLastSelect == undefined)
                    selectRow(idx.peek(), { mouse: true })
                  else
                    mouseLastSelect = idx.peek()
                }}/>
                <box>
                  <image iconName={app.iconName}/>
                  <label label={app.name} wrap/>
                </box>
              </Button>
            </Gtk.ListBoxRow>}
          </For>
        </Gtk.ListBox>
      </Gtk.ScrolledWindow>
    </box>
  </BaseWindow>
}
// TODO: check if keywords/categories/description should be shown

export default Launcher