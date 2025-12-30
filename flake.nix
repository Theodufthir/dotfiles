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
      default = pkgs.stdenv.mkDerivation rec { # TODO find a way to include tabler-icons font
        name = "astal-bar";
        src = ./.;
        entry = "app.ts";

        nativeBuildInputs = with pkgs; [
          wrapGAppsHook4
          gobject-introspection
          ags.packages.${system}.default
        ];

        # additional libraries and executables to add to gjs' runtime
        buildInputs = (with ags.packages.${system}; [
          astal4
          io
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
        ]) ++ (with pkgs; [
          gjs
          sassc
        ]);
        
        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r * $out/share

          ags bundle ${entry} $out/bin/${name} -d "SRC='$out/share'"

          runHook postInstall
        '';
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell { # TODO find a way to include tabler-icons font
        name = "astal-dev";

        buildInputs = [
          pkgs.nodejs
          pkgs.sassc
        ];

        packages = [
          ags.packages.${system}.agsFull
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
