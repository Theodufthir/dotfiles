{ pkgs, astal-bar, nixvim, ... }@args: hm-host-overlay:
hm-host-overlay args {
  imports = [astal-bar];

  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = true;
    configType =  "hyprlang";
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

  services.hyprsunset = {
    enable = true;
    settings = import ./hyprsunset.nix;
  };

  i18n.inputMethod = {
    type = "fcitx5";
    enable = true;
    fcitx5 = {
      waylandFrontend = true;
      ignoreUserConfig = true;
      addons = with pkgs; [
        fcitx5-gtk
        fcitx5-mozc
      ];
      settings = {
        inputMethod = {
          "Groups/0" = {
            Name = "Default";
            "Default Layout" = "fr";
            DefaultIM = "keyboard-fr";
          };
          "Groups/0/Items/0".Name = "keyboard-fr";
          "Groups/0/Items/1".Name = "mozc";
        };
      };
    };
  };

  home.packages = with pkgs; [
    via
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
    ardour
    godot-mono
  ] ++ (with jetbrains; [
    pycharm
    webstorm
  ]) ++ [
    nixvim
  ];

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

  programs.bash = {
    enable = true;
    enableCompletion = true;
  };

  programs.direnv = {
    enable = true;
  };

  programs.fzf = {
    enable = true;
    enableBashIntegration = true;
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

  programs.btop.enable = true;

  programs.home-manager.enable = true;
  home.stateVersion = "26.05";
}
