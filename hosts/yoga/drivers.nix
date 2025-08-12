{ pkgs, ... }:
{
  nixpkgs.config.rocmSupport = true;

  environment.systemPackages = [
    pkgs.fprintd
    pkgs.libusb1
  ];

  services.fprintd = {
    enable = true; # Not supported for now
  };

  hardware.sensor.iio.enable = true;
  boot.extraModprobeConfig = ''
    options snd_hda_intel index=1,0
  '';
}
