import Gtk from "gi://Gtk";
import symbols from "../../../assets/tabler-icons.json";
import { Accessor, CCProps } from "gnim";
import { createBindingOrApply } from "../../../utils/variables";

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
    class={createBindingOrApply(props.class, cls => `tabler-icon ${cls}`)}
    // @ts-ignore
    label={createBindingOrApply(icon, icn => symbols[icn] ?? alt)}
  />


export default TablerIcon
