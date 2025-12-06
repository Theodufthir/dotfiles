# Help is available in the configuration.nix(5) man page or with 'nixos-help'

{ config, pkgs, ... }:
{
  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # Networking
  networking.networkmanager.enable = true;
  networking.hostName = "deskix";

  services.automatic-timezoned.enable = true;

  # Select internationalisation properties.
  i18n.defaultLocale = "en_US.UTF-8";

  i18n.extraLocaleSettings = {
    LC_ADDRESS = "fr_FR.UTF-8";
    LC_IDENTIFICATION = "fr_FR.UTF-8";
    LC_MEASUREMENT = "fr_FR.UTF-8";
    LC_MONETARY = "fr_FR.UTF-8";
    LC_NAME = "fr_FR.UTF-8";
    LC_NUMERIC = "fr_FR.UTF-8";
    LC_PAPER = "fr_FR.UTF-8";
    LC_TELEPHONE = "fr_FR.UTF-8";
    LC_TIME = "fr_FR.UTF-8";
  };

  # Gnome config
  services.displayManager.gdm.enable = true;
  services.desktopManager.gnome.enable = true;

  # Wayland config
  environment.sessionVariables.NIXOS_OZONE_WL = "1";

  # X11 config for compat
  services.xserver.enable = true;
  services.xserver.xkb.layout = "fr";

  # Configure console keymap
  console.keyMap = "fr";

  # Enable CUPS to print documents.
  services.printing.enable = true;
  
  # Fonts
  fonts = {
    enableDefaultPackages = true;
    packages = with pkgs; [
      nerd-fonts._0xproto
      noto-fonts-cjk-sans
      noto-fonts-emoji
    ];
    
    fontconfig = {
      defaultFonts = {
        sansSerif = [
	        "noto-fonts-cjk-sans"
	        "noto-fonts"
	        "0xproto"
	      ];
      };
    };
  };

  hardware.keyboard.qmk.enable = true;
  services.udev.packages = [pkgs.via];
  
  hardware.bluetooth = {
    enable = true;
    powerOnBoot = true;
  };

  security.rtkit.enable = true;
  services.pulseaudio.enable = false;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    jack.enable = true;
  };

  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  boot.kernelPackages = pkgs.linuxPackages_latest;

  virtualisation.docker.enable = true;

  environment.systemPackages = (with pkgs; [
    vim
    git
    wget
    tree
    htop
  ]);

  services.openssh.enable = true;
  services.tailscale.enable = true;

  # Firewall options .allowedTCP/UDP or .enable
  # networking.firewall.enable = false;

  # DO NOT CHANGE THIS (or read the documentation for it https://nixos.org/nixos/options.html).
  system.stateVersion = "25.05"; # Did you read the comment?

}
