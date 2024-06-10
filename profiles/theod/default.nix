{ config, pkgs-unstable, ... }:
{
  xdg.portal = {
    enable = true;
    config = {
      common.default = [ "gtk" ];
    };
    extraPortals = [
      pkgs-unstable.xdg-desktop-portal-hyprland
    ];
  };

  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = true;
    settings = import ./hyprland.nix;
  };

  programs.hyprlock = {
    enable = true;
    settings = import ./hyprlock.nix;
  };

  services.hypridle = {
    enable = true;
    settings = import ./hypridle.nix;
  };

  home.packages = (with pkgs-unstable; [
    foot
    firefox
    brightnessctl
    webcord-vencord
    playerctl
    jq
    wofi
    eww
    tabler-icons
    jetbrains.pycharm-professional
    watershot
    grim
    satty
  ]);

  services.flameshot.enable = true;

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
      edit-config-nixos = "(cd /etc/nixos && sudo vim .)";
      edit-config-eww = "(cd ~/.config/eww && vim .)";
      rebuild-nixos = "sudo nixos-rebuild switch";
      update-nixos = "(cd /etc/nixos && sudo nix flake update)";
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
