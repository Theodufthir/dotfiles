{ self, nixpkgs, nixpkgs-unstable, home-manager, ... }@inputs: {
  nixosSystem = {
    folder, system,
    useUnstable ? true,
    specialArgs ? {},
    hasHomeManager ? true,
    modules ? [],
    overlays ? []
  }:
  (if useUnstable then nixpkgs-unstable else nixpkgs).lib.nixosSystem {
    inherit system;

    specialArgs = {
      self = self;
      hm-host-overlay = if !hasHomeManager then {} else
        import (./. + "/${folder}/home-manager.nix");
    } // (if !useUnstable then {} else {
      pkgs-stable-25-05 = import nixpkgs {
        inherit system overlays;
        config.allowUnfree = true;
      };
    }) // specialArgs;

    modules = modules ++ [
      (./. + "/${folder}/configuration.nix")
      (./. + "/${folder}/drivers.nix")
      (./. + "/${folder}/hardware-configuration.nix")
      {
        nixpkgs.overlays = overlays;
        nixpkgs.config.allowUnfree = true;
        nix.settings = {
          experimental-features = [ "nix-command" "flakes" ];
          extra-substituters = [
            "https://nix-community.cachix.org"
          ];
          extra-trusted-public-keys = [
            "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
          ];
        };
      }
    ] ++ (if !hasHomeManager then [] else [
      home-manager.nixosModules.home-manager
      {
        home-manager.useGlobalPkgs = true;
        home-manager.useUserPackages = true;
      }
    ]);
  };
}
