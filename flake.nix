{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system} = {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "bar";
        entry = "app.ts";

        # additional libraries and executables to add to gjs' runtime
        extraPackages = with ags.packages.${system}; [
          hyprland
          mpris
          battery
          bluetooth
          notifd
          network
          tray
          wireplumber
          tray
          powerprofiles
          apps
        ];
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        packages = [pkgs.nodejs];

        buildInputs = [
          # includes all Astal libraries
          ags.packages.${system}.agsFull

          # includes astal3 astal4 astal-io by default
          (ags.packages.${system}.default.override { extraPackages = with ags.packages.${system}; []; })
        ];
      };
    };
  };
}
