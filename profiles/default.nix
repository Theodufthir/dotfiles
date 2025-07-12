{ config, pkgs, pkgs-latest, home-manager, ... }@self: {
  home-manager.users = {
    theod = import ./theod/home-manager.nix self;
  };
  
  users.users = {
    theod = {
      isNormalUser = true;
      description = "Théo Dufour";
      extraGroups = [ "networkmanager" "wheel" "audio" "docker" ];
    };
  };
}
