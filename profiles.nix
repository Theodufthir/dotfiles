{ config, pkgs, pkgs-latest, home-manager, ... }@self: {
  home-manager.users = {
    theod = import ./profiles/theod/home-manager.nix self;
  };
  
  users.users = {
    theod = {
      isNormalUser = true;
      description = "Théo Dufour";
      extraGroups = [ "networkmanager" "wheel" "audio" "docker" ];
    };
  };
}
