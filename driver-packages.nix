{ pkgs, ... }:
{
#  environment.systemPackages = with pkgs; [
#    fprintd
#  ];

#  services.fprintd = {
#    enable = true; # Not supported for now
#    package = pkgs.fprintd-tod;
#    tod = {
#      enable = true;
#      driver = pkgs.libfprint-2-tod1-goodix;
#    };
#  };

  hardware.sensor.iio.enable = true;
  boot.extraModprobeConfig = ''
    options snd_hda_intel index=1,0
  '';
#   options snd_hda_intel model=alc287-yoga9-bass-spk-pin
}
