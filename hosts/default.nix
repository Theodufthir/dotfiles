{ self, nixpkgs, nixpkgs-unstable, home-manager, astal-bar, ... }@inputs:
let
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
      hm-host-config = if !hasHomeManager then {} else import (./. + "/${folder}/home-manager.nix");
    } // (if !useUnstable then {} else {
      pkgs-stable-25-05 = import nixpkgs {
        inherit system overlays;
        config.allowUnfree = true;
      };
    }) // specialArgs;

    modules = modules ++ [
      (./. + "/${folder}/configuration.nix")
      (./. + "/${folder}/drivers.nix")
      {
        nixpkgs.overlays = overlays;
        nixpkgs.config.allowUnfree = true;
      }
      {
        nix.settings = {
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
in {
  yoga = nixosSystem rec {
    folder = "yoga";
    system = "x86_64-linux";
    specialArgs = {
	    astal-bar = astal-bar.homeManagerModules.default;
    };
    overlays = [
      (final: prev: {
        fprintd = inputs.fprintd-55b4.packages.${system}.fprintd;
      })
    ];
    modules = [
      ../profiles
      { programs.hyprland.enable = true; }
    ];
  };

  desk = nixosSystem rec {
    folder = "desk";
    system = "x86_64-linux";
    specialArgs = {
	    astal-bar = astal-bar.homeManagerModules.default;
    };
    modules = [
      ../profiles
      { programs.hyprland.enable = true; }
      { 
        nix.settings = {
          substituters = [
            "https://cuda-maintainers.cachix.org"
          ];
          trusted-public-keys = [
            "cuda-maintainers.cachix.org-1:0dq3bujKpuEPMCX6U4WylrUDZ9JyUG0VpVZa7CNfq5E="
          ];
        };
      }
    ];
  };
}
