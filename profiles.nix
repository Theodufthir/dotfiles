{ config, pkgs, pkgs-latest, home-manager, ... }@self: {
  home-manager.users = {
    theod = import ./profiles/theod self;
  };
}
