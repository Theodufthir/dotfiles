{ pkgs, ... }:
{
  nixpkgs.config.cudaSupport = true;

  services.xserver.videoDrivers = [ "nvidia" ];
  hardware.graphics.enable = true;
  hardware.nvidia = {
    powerManagement.enable = true;
    open = false;
  };
}
