import Gtk from "gi://Gtk";
import symbols from "../../../assets/tabler-icons.json";
import { Accessor, CCProps } from "gnim";
import { bindOrApply } from "../../../utils/variables";

export type TablerIconName = keyof typeof symbols

export interface TablerIconProps extends Partial<CCProps<Gtk.Label, Gtk.Label.ConstructorProps>> {
  icon: TablerIconName | Accessor<TablerIconName | string>;
  alt?: string;
  size?: number;
}

const TablerIcon = ({ icon, alt = "???", size, ...props }: TablerIconProps) =>
  <label
    {...props}
    css={"font-family: 'tabler-icons'; " + (size ? `font-size: ${size}px; ` : "") + (props.css ?? "")}
    class={bindOrApply(props.class, cls => `tabler-icon ${cls}`)}
    // @ts-ignore
    label={bindOrApply(icon, icn => symbols[icn] ?? alt)}
  />


export default TablerIcon
