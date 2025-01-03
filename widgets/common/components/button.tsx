import { Widget, Astal } from "astal/gtk3"

export interface ButtonProps extends Widget.ButtonProps {
  onPrimaryClick?: (self?: Widget.Button, event?: Astal.ClickEvent) => any;
  onSecondaryClick?: (self?: Widget.Button, event?: Astal.ClickEvent) => any;
  onMiddleClick?: (self?: Widget.Button, event?: Astal.ClickEvent) => any;
  onBackClick?: (self?: Widget.Button, event?: Astal.ClickEvent) => any;
  onForwardClick?: (self?: Widget.Button, event?: Astal.ClickEvent) => any;
}

const Button = ({ onPrimaryClick, onSecondaryClick, onMiddleClick, onForwardClick, onBackClick, ...props }: ButtonProps) => (
  <button onClick={(button, event) => {
    const toExecute = {
      [Astal.MouseButton.PRIMARY]: onPrimaryClick,
      [Astal.MouseButton.SECONDARY]: onSecondaryClick,
      [Astal.MouseButton.MIDDLE]: onMiddleClick,
      [Astal.MouseButton.FORWARD]: onForwardClick,
      [Astal.MouseButton.BACK]: onBackClick,
    }[event.button]
    toExecute?.(button, event)
  }} {...props}/>
)

export default Button