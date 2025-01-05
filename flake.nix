{
  description = "Basic NixOS flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "github:Theodufthir/nixpkgs/fix-hyprland";
    #nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    tabler-icons.url = "github:theodufthir/tabler-icons-nixpkg";
    ags.url = "github:aylur/ags/v1";
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, home-manager, ags, tabler-icons, ... }@inputs: {
    nixosConfigurations = {
      nixos = nixpkgs-unstable.lib.nixosSystem rec {
        system = "x86_64-linux";
        
        specialArgs = {
          pkgs-unstable = import nixpkgs-unstable {
            inherit system;
            config.allowUnfree = true;
            overlays = [
              tabler-icons.overlays.default
            ];
          };
	  ags = ags.homeManagerModules.default;
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
