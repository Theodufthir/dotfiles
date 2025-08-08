{ home-manager, pkgs, hm-host-config ? {}, ... }@self: {
  home-manager.users = {
    theod = pkgs.lib.recursiveUpdate (import ./theod/home-manager.nix self) hm-host-config;
  };

  users.groups.usb = {};
  users.users = {
    theod = {
      isNormalUser = true;
      description = "Théo Dufour";
      extraGroups = [ "networkmanager" "wheel" "audio" "docker" "usb" ];
    };
  };
}
