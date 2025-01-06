import symbols from "../../../assets/tabler-icons.json"
import { Binding } from "astal"
import { Widget } from "astal/gtk3"

export type TablerIconName = keyof typeof symbols

export interface TablerIconProps extends Widget.LabelProps {
  icon: TablerIconName | Binding<TablerIconName | string>
  alt?: string
  size?: number
}

const TablerIcon = ({ icon, alt = "???", size, ...props }: TablerIconProps) => {
  return <label
    {...props}
    css={"font-family: 'tabler-icons'; " + (size ? `font-size: ${size}px; ` : "") + (props.css ?? "")}
    className={"tabler-icon " + (props.className ?? "")}
    // @ts-ignore
    label={(typeof(icon) === "string") ? symbols[icon] ?? alt : icon.as(value => symbols[value] ?? alt)}/>
}

export default TablerIcon
