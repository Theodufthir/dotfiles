{ config, pkgs-unstable, ags, ... }:
{
  imports = [ ags ];

  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = true;
    inherit (import ./hyprland.nix) settings extraConfig;
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
#    iio-hyprland #tofix
    foot
    brightnessctl
    webcord-vencord
    playerctl
    jq
    wofi
    eww
    tabler-icons
    jetbrains.pycharm-professional
    jetbrains.phpstorm
    jetbrains.webstorm
    grimblast
    satty
    vscode
    alsa-utils
    sassc
  ]);

  fonts.fontconfig.enable = true;

  programs.firefox = {
    enable = true;
/*    profiles.default.userChrome = ''
#main-window[inFullscreen] #PersonalToolbar {
 visibility:visible!important;
}
''; */
  };

  programs.git = {
    enable = true;
    userName = "Théo Dufour";
    userEmail = "theo.dufthir@gmail.com";
  };

  programs.neovim = {
    enable = true;
    vimAlias = true;
    
    extraConfig = ''
set number
colorscheme slate

set tabstop=2
set shiftwidth=2
set expandtab
set smartindent
'';
    defaultEditor = true;
  };

  programs.bash = {
    enable = true;
    enableCompletion = true;
    
    shellAliases = {
      edit-config-nixos = "(cd /etc/nixos && sudo vim .)";
      edit-config-eww = "(cd ~/.config/eww && vim .)";
      edit-config-ags = "(cd ~/.config/ags && vim .)";
      rebuild-nixos = "sudo nixos-rebuild switch";
      update-nixos = "(cd /etc/nixos && sudo nix flake update)";
      list-generations = "sudo nix-env --profile /nix/var/nix/profiles/system --list-generations"; 
      delete-generations = "sudo nix-env --profile /nix/var/nix/profiles/system --delete-generations";
      delete-generations-all = ''for gen in $(list-generations | sed -rn 's/\s*([0-9]+).*/\1/p' | head -n -1); do delete-generations $gen; done && nix-collect-garbage -d'';
      clean-tmp-edit = ''find . -name '*~' -exec rm -rfi {} \;'';
    };
  };

  programs.ags = {
    enable = true;

    extraPackages = with pkgs-unstable; [
      gtksourceview
      webkitgtk
      accountsservice
    ];
  };

  systemd.user.services.auto-rotate = import ./auto-rotate.service.nix pkgs-unstable "eDP-1";

  programs.home-manager.enable = true;
  home.stateVersion = "23.11";
}
