{ config, lib, pkgs, modulesPath, ... }:
{
  imports = [(modulesPath + "/installer/scan/not-detected.nix")];

  boot.initrd.availableKernelModules = ["nvme" "xhci_pci" "thunderbolt" "usb_storage" "uas" "usbhid" "sd_mod" "sdhci_pci"];
  boot.initrd.kernelModules = [];
  boot.kernelModules = ["kvm-amd"];
  boot.extraModulePackages = [];

  fileSystems."/" = {
    device = "/dev/disk/by-uuid/7f5c3a9f-3cf8-4252-abf5-92119aa748de";
    fsType = "ext4";
  };

  fileSystems."/boot" = {
    device = "/dev/disk/by-uuid/5A9A-697D";
    fsType = "vfat";
  };

  swapDevices = [{
    device = "/dev/disk/by-partuuid/206c9ed6-7b23-4066-a19c-e972691048d2";
    randomEncryption.enable = true;
    options = ["discard"];
  }];

  zramSwap.enable = true;

  networking.useDHCP = lib.mkDefault true; # DHCP can be enabled granularly by interface

  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
  hardware.cpu.amd.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
}
