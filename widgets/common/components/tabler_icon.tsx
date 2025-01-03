import { Widget } from "astal/gtk3"
import { Binding } from "astal"
import { readFile } from "astal/file"

export interface TablerIconProps extends Widget.LabelProps {
  icon: string | Binding<string>
  alt?: string
  size?: number
}

const symbols = JSON.parse(readFile('./assets/tabler-icons.json'))

const TablerIcon = ({ icon, alt = "???", size, ...props }: TablerIconProps) => {
  return <label
    {...props}
    css={"font-family: 'tabler-icons'; " + (size ? `font-size: ${size}; ` : "") + (props.css ?? "")}
    className={"tabler-icon " + (props.className ?? "")}
    label={(typeof(icon) === "string") ? symbols[icon] ?? alt : icon.as(value => symbols[value] ?? alt)}/>
}

export default TablerIcon
