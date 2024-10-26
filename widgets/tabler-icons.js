const symbols = JSON.parse(Utils.readFile(`${App.configDir}/assets/tabler-icons.json`))

function TablerIcon({ icon, alt = "???", ...params }) {
  let label = null 
  if (typeof(icon) === "string") {
    label = symbols[icon] ?? alt
  } else {
    label = icon.as(value => symbols[value] ?? alt)
  }
  return Widget.Label({
    ...params,
    css: "font-family: 'tabler-icons'; " + (params.size ? `font-size: ${params.size}; ` : "") + (params.css ?? ""),
    class_name: "tabler-icon " + (params.class_name ?? ""),
    label
  })
}

export {
  TablerIcon
}
