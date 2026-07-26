{
  description = "A Nixvim configuration";

  inputs = {
    nixvim.url = "github:nix-community/nixvim";
    nixpkgs.follows = "nixvim/nixpkgs";
  };

  outputs = { nixpkgs, nixvim, ... }:
    let
      config = import ./config.nix;

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      allSystems = nixpkgs.lib.genAttrs systems;
    in rec {
      modules = [
        config
        { nixpkgs.config.allowUnfree = true; }
      ];

      packages = allSystems (
        system:
        let
          eval = nixvim.lib.evalNixvim { inherit system modules; };
          nvim = eval.config.build.package;
        in rec {
          default = eval.config.build.package;
          nvim = default;
        }
      );
    };
}
