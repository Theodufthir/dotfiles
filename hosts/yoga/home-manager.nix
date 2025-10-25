{
  wayland.windowManager.hyprland.settings = {
    monitor = [
      "desc:Samsung Display Corp. 0x417A,preferred,auto,2"
      "desc:AOC Q24G2 ZQVQ3HA005748,preferred,auto-left,1.25"
      "desc:Samsung Electric Company U32J59x HNMW800784,preferred,auto-left,1.5"
      "desc:Samsung Electric Company U32J59x HNMW800791,preferred,auto-right,1.5"
      "desc:Invalid Vendor Codename - RTK RTK QHD HDR demoset-1,preferred,auto-left,1.6"
      "desc:LG Electronics LG TV SSCR2 0x01010101,preferred,auto-up,3"
      ",preferred,auto,auto"
    ];

    input = {
      touchpad.natural_scroll = "yes";
      touchdevice.output = "eDP-1";
      tablet.output = "eDP-1";
    };
  };

  programs.hyprlock.settings.auth.fingerprint.enabled = true;
}
