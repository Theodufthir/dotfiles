# Help is available in the configuration.nix(5) man page or with 'nixos-help'

{ config, pkgs-unstable, ... }:
{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
      ./driver-packages.nix
    ];


  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "nixos"; # Define your hostname.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Enable networking
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "Europe/Paris";

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


  # X11 config
  services.xserver.enable = true;
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;
  services.xserver.xkb.layout = "fr";
  
  services.libinput.enable = true; # touchpad support

  # Wayland config
  environment.sessionVariables.NIXOS_OZONE_WL = "1";

  # Configure console keymap
  console.keyMap = "fr";

  # Enable CUPS to print documents.
  services.printing.enable = true;

  # Fonts
  fonts = {
    enableDefaultPackages = true;
    packages = with pkgs-unstable; [
      noto-fonts
      noto-fonts-cjk-sans
      noto-fonts-emoji
    ];
  
    fontconfig = {
      defaultFonts = {
        sansSerif = [ "noto-fonts" "noto-fonts-cjk-sans" ];
      };
    };
  };

  hardware.pulseaudio.enable = false;
  hardware.bluetooth = {
    enable = true;
    powerOnBoot = true;
  };

  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    # jack.enable = true;
  };

  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  boot.kernelPackages = pkgs-unstable.linuxPackages_latest;

  virtualisation.docker.enable = true;

  environment.systemPackages = (with pkgs-unstable; [
    kitty
    vim
    git
    wget
    tree
    htop
  ]);

  services.upower = {
    enable = true;
    percentageLow = 30;
    percentageCritical = 15;
    percentageAction = 10;
    criticalPowerAction = "HybridSleep";
  };

  # Enable the OpenSSH daemon.
  services.openssh.enable = true;

  # Firewall options .allowedTCP/UDP or .enable
  # networking.firewall.enable = false;

  # DO NOT CHANGE THIS (or read the documentation for it https://nixos.org/nixos/options.html).
  system.stateVersion = "23.11"; # Did you read the comment?
}
