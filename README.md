# Personal UI shell
Made with [Astal](https://github.com/aylur/ags) and [Gnim](https://github.com/aylur/gnim/) and bundled with [AGS](https://github.com/aylur/astal)

## Installation
Uses Nix, the repo contains a flake with both a regular and a Home Manager package.
HM module also includes Tabler icons theme (mandatory), sassc (mandatory) and AGS (optional but recommanded for faster CLI handling)
The shell also interacts with Hyprland, NetworkManager, bluetoothd, mpris, wireplumber, powerprofiles by default and with battery, brightnessctl if detected.

## Usage
<a id="Starting"></a>
### Starting the main instance
The command provided is `astal-bar`, it starts the shell.

### CLI
The main instance can receive messages though DBUS via the `astal-bar <cmd> <args>` syntax.
Those CLI commands and their arguments are the following:
- `start`, `run`: same as (here)[#Starting], starts the main instance
- `quit`,`stop`: stops the main instance
- `launcher`: toggles the launcher on the current screen
- `list`: list all windows available
- `toggle <window-name>`: toggle a window
Bear in mind that you need to have the main instance running for all commands to work (except `start` and `run`) 

## Things I'm working on:
- launcher
- clarifying flake inputs and build
- some state issues with wifi, bluetooth sections
- issues with keeping up to date with monitors addition/removal
- UI/UX (everchanging)

## Things to consider in the future:
- Weather info
- GTK theme integration
- Quick lyrics viewer
- Some CI/CD and/or devops
