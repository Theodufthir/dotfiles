{
  description = "Basic NixOS flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    astal-bar.url = "github:theodufthir/dotfiles/astal-config";
    fprintd-55b4.url = "github:/oscar-schwarz/libfprint-goodix-55b4/55b4-experimental";
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, home-manager, astal-bar, fprintd-55b4, ... }@inputs: {
    nixosConfigurations = {
      nixos = nixpkgs-unstable.lib.nixosSystem rec {
        system = "x86_64-linux";
        
        specialArgs = {
          pkgs-unstable = import nixpkgs-unstable {
            inherit system;
            config.allowUnfree = true;
          };
	  fprintd-55b4 = fprintd-55b4.packages.${system}.default;
	  astal-bar = astal-bar.homeManagerModules.default;
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
