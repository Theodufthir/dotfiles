{ self, pkgs, ... }@args: hm-config:
pkgs.lib.recursiveUpdate hm-config rec {
  wayland.windowManager.hyprland.settings = {
    cursor.no_hardware_cursors = 1;
    monitor = [
      "desc:Samsung Display Corp. 0x417A,preferred,auto-right,2"
      "desc:AOC Q24G2 ZQVQ3HA005748,preferred,auto,1.25"
      "desc:Philips Consumer Electronics Company Philips 236VL UHB1151013906,preferred,auto-left,1"
      "desc:Samsung Electric Company U32J59x HNMW800784,preferred,auto-left,1.5"
      "desc:Samsung Electric Company U32J59x HNMW800791,preferred,auto-right,1.5"
      "desc:Invalid Vendor Codename - RTK RTK QHD HDR demoset-1,preferred,auto-left,1.6"
      "desc:LG Electronics LG TV SSCR2 0x01010101,preferred,auto-up,3"
      ",preferred,auto,auto"
    ];
  };
}
