{ self, nixpkgs, nixpkgs-unstable, home-manager, astal-bar, ... }@inputs: {
  yoga = nixpkgs-unstable.lib.nixosSystem rec {
    system = "x86_64-linux";
        
    specialArgs = {
      pkgs-unstable = import nixpkgs-unstable {
        inherit system;
        config.allowUnfree = true;
      };
	    fprintd-55b4 = inputs.fprintd-55b4.packages.${system}.default;
	    astal-bar = astal-bar.homeManagerModules.default;
    };
        
    modules = [
      home-manager.nixosModules.home-manager
      {
        home-manager.useGlobalPkgs = true;
        home-manager.useUserPackages = true;
      }
          
      ../profiles
          
      { programs.hyprland.enable = true; }
          
      yoga/configuration.nix
    ];
  };
  desk = nixpkgs-unstable.lib.nixosSystem rec {
    system = "x86_64-linux";
        
    specialArgs = {
      pkgs-unstable = import nixpkgs-unstable {
        inherit system;
        config.allowUnfree = true;
      };
	    astal-bar = astal-bar.homeManagerModules.default;
      hm-host-config = import desk/home-manager.nix;
    };
        
    modules = [
      home-manager.nixosModules.home-manager
      {
        home-manager.useGlobalPkgs = true;
        home-manager.useUserPackages = true;
      }

      ../profiles
      
      { programs.hyprland.enable = true; }
          
      desk/configuration.nix
    ];
  };
}
