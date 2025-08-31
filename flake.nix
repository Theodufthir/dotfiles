{
  description = "theodufthir's config";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs-unstable";
    };
    astal-bar.url = "github:theodufthir/dotfiles/astal-config";
    fprintd-55b4.url = "github:/oscar-schwarz/libfprint-goodix-55b4/55b4-experimental";
  };

  outputs = { self, nixpkgs-unstable, home-manager, ... }@inputs: {
    nixosConfigurations = import ./hosts inputs;
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
