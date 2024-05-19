{ config, pkgs-unstable, ... }:
{
  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = true;
    settings = import ./hyprland.nix;
  };

  home.packages = (with pkgs-unstable; [
    foot
    firefox
    brightnessctl
    discord
    playerctl
    jq
    wofi
    xdg-desktop-portal-hyprland
    eww
    tabler-icons
  ]);

  fonts.fontconfig.enable = true;

  programs.git = {
    enable = true;
    userName = "Théo Dufour";
    userEmail = "theo.dufthir@gmail.com";
  };

  programs.bash = {
    enable = true;
    enableCompletion = true;
    
    shellAliases = {
      edit-config-nixos = "cd /etc/nixos && sudo vim . && cd -";
      edit-config-eww = "cd ~/.config/eww && vim . && cd -";
      rebuild-nixos = "sudo nixos-rebuild switch";
      battery-info = ''upower -i $(upower --dump | sed -rn 's/Device:\s*(.*BAT.*?)\s*$/\1/p')'';
      list-generations = "sudo nix-env --profile /nix/var/nix/profiles/system --list-generations"; 
      delete-generations = "sudo nix-env --profile /nix/var/nix/profiles/system --delete-generations";
      delete-generations-all = ''for gen in $(list-generations | sed -rn 's/\s*([0-9]+).*/\1/p' | head -n -1); do delete-generations $gen; done && nix-collect-garbage -d'';
      clean-tmp-edit = ''find . -name '*~' -exec rm -rfi {} \;'';
    };
  };

  systemd.user.services.auto-rotate = import ./auto-rotate.service.nix pkgs-unstable "eDP-1";

  programs.home-manager.enable = true;
  home.stateVersion = "23.11";
}
