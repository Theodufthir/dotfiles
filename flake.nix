{
  description = "Basic NixOS flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-latest.url = "github:NixOS/nixpkgs/master";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    tabler-icons.url = "github:theodufthir/tabler-icons-nixpkg";
    watershot.url = "github:Kirottu/watershot";
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, nixpkgs-latest, home-manager, tabler-icons, watershot, ... }@inputs: {
    nixosConfigurations = {
      nixos = nixpkgs-unstable.lib.nixosSystem rec {
        system = "x86_64-linux";
        
        specialArgs = {
          pkgs-unstable = import nixpkgs-unstable {
            inherit system;
            config.allowUnfree = true;
            overlays = [
              tabler-icons.overlays.default
              (final: prev: { inherit (watershot.packages.${prev.system}.default); })
            ];
          };
          pkgs-latest = import nixpkgs-latest {
            inherit system;
            config.allowUnfree = true;
          };
        };
        
        modules = [
          home-manager.nixosModules.home-manager
          {
            home-manager.useGlobalPkgs = true;
            home-manager.useUserPackages = true;
          }
          
          ./profiles.nix
          
          { programs.hyprland.enable = true; }
          
          ./configuration.nix
        ];
      };
    };
    homeConfigurations = {
      theod = home-manager.lib.homeManagerConfiguration {
        pkgs = nixpkgs-unstable.legacyPackages.x86_64-linux;
        
        modules = [
          { home-manager.users.theod = import ./home.nix; }
        ];
      };
    };
  };
}
