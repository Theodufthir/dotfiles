{
  description = "Astal UI shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    
    tabler-icons = {
      url = "github:theodufthir/tabler-icons-nixpkg";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    
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
    tabler-icons,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { 
      inherit system;
      overlays = [ tabler-icons.overlays.default ];
    };
  in rec {
    packages.${system} = {
      default = ags.lib.bundle { # TODO find a way to include tabler-icons font

        inherit pkgs;
        src = ./.;
        name = "astal-bar";
        entry = "app.ts";

        # additional libraries and executables to add to gjs' runtime
        extraPackages = (with ags.packages.${system}; [
          hyprland
          mpris
          battery
          bluetooth
          notifd
          network
          tray
          wireplumber
          powerprofiles
          apps
        ]) ++ [pkgs.sassc];
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell { # TODO find a way to include tabler-icons font
        packages = with pkgs; [nodejs];

        buildInputs = [
          ags.packages.${system}.agsFull

          # includes astal3 astal4 astal-io by default
          (ags.packages.${system}.default.override { extraPackages = with ags.packages.${system}; []; })
        ];
      };
    };

    homeManagerModules = {
      default = self.homeManagerModules.astal-bar;
      astal-bar.config.home.packages = [
        packages.${system}.default
        pkgs.tabler-icons
      ];
    };
  };
}
