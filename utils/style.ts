import { App } from "astal/gtk3"
import { exec } from "astal/process"

function reloadCss() {
  const scss = `./style.scss`
  const css = `/tmp/ags-style.css`
  exec(`sassc -t compressed ${scss} ${css}`)
  App.reset_css()
  App.apply_css(css)
}

export {
  reloadCss
}
