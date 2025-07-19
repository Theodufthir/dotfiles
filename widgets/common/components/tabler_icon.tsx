import symbols from "../../../assets/tabler-icons.json"
import { Binding } from "astal"
import { Widget } from "astal/gtk3"
import { bindOrApply } from "../../../utils/variables";

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
    className={bindOrApply(props.className, className => `tabler-icon ${className}`)}
    // @ts-ignore
    label={bindOrApply(icon, icn => symbols[icn] ?? alt)}/>
}

export default TablerIcon
