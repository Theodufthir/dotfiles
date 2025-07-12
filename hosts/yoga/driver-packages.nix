{ pkgs, fprintd-55b4, ... }:
{
  environment.systemPackages = [
    #fprintd-55b4
    pkgs.libusb1
  ];

  services.fprintd = {
    enable = true; # Not supported for now
    #package = pkgs.fprintd.override { libfprint = fprintd-55b4; };
  };

  hardware.sensor.iio.enable = true;
  boot.extraModprobeConfig = ''
    options snd_hda_intel index=1,0
  '';
}
