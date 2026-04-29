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
    in {
      packages = allSystems (
        system:
        let
          buildNVim = nixvim.legacyPackages.${system}.makeNixvim;
          nvim = buildNVim config;
        in
        {
          inherit nvim;
          default = nvim;
        }
      );
/*
      checks = allSystems {
        system:
        let
          lib = nixvim.lib.${system};
        in {
          checks.default = lib.check.mkTestDerivationFromNixvimModule nixvimModule;
        }
      };
*/
    };
}
