{ pkgs, astal-bar, ... }@args: hm-host-overlay:
hm-host-overlay args {
  imports = [ astal-bar ];

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

  home.packages = with pkgs; [
    via
    btop
    iio-hyprland #tofix
    foot
    brightnessctl
    webcord-vencord
    playerctl
    jq
    wofi
    wireshark
    grimblast
    satty
    vscode
    alsa-utils
    sassc
    ardour
    godot-mono
  ] ++ (with jetbrains; [
    pycharm-professional
    phpstorm
    webstorm
    rider
    clion
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
    settings.user = {
      name = "Théo Dufour";
      email = "theo.dufthir@gmail.com";
    };
  };

  programs.neovim = {
    enable = true;
    inherit (import ./neovim.nix) extraConfig;
    vimAlias = true;
    defaultEditor = true;
  };

  programs.bash = {
    enable = true;
    enableCompletion = true;
  };

  programs.direnv = {
    enable = true;
  };

  programs.starship = {
    enable = true;
    enableBashIntegration = true;
    settings = import ./starship.nix;
  };

  programs.foot = {
    enable = true;
    settings.main.font = "monospace:size=11,0xproto";
  };

  home.shellAliases = {
    list-generations = "nixos-rebuild list-generations";
    delete-generations = "sudo nix-env --profile /nix/var/nix/profiles/system --delete-generations";
    delete-generations-all = ''for gen in $(list-generations | sed -rn 's/\s*([0-9]+).*/\1/p' | head -n -1); do delete-generations $gen; done && nix-collect-garbage -d'';
    clean-tmp-edit = ''find . -name '*~' -exec rm -rfi {} \;'';
  };

  programs.home-manager.enable = true;
  home.stateVersion = "25.05";
}
