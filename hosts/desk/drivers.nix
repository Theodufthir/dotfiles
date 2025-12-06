{ pkgs, ... }:
{
  nixpkgs.config.cudaSupport = false;

  services.xserver.videoDrivers = [ "nvidia" ];
  hardware.graphics.enable = true;
  hardware.nvidia = {
    powerManagement.enable = true;
    open = false;
  };
}
