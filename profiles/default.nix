{ home-manager, pkgs, hm-host-overlay ? (args: hm-config: hm-config), ... }@args: {
  home-manager.users = {
    theod = import ./theod/home-manager.nix args hm-host-overlay;
  };

  users.groups.usb = {};
  users.users = {
    theod = {
      isNormalUser = true;
      description = "Théo Dufour";
      extraGroups = [ "networkmanager" "wheel" "audio" "docker" "usb" "wireshark" ];
    };
  };
}
