import App from "ags/gtk4/app";
import { exec } from "ags/process";

function reloadCss() {
  const scss = `${SRC}/style.scss`
  const css = `/tmp/ags-style.css`
  exec(`sassc -t compact ${scss} ${css}`)
  App.reset_css()
  App.apply_css(css)
}

export {
  reloadCss
}
