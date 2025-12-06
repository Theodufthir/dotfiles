{ self, fprintd-55b4, astal-bar, ... }@inputs:
with (import ./common.nix inputs); {
  yoga = nixosSystem rec {
    folder = "yoga";
    system = "x86_64-linux";
    specialArgs = {
	    astal-bar = astal-bar.homeManagerModules.default;
    };
    overlays = [
      (final: prev: {
        fprintd = fprintd-55b4.packages.${system}.fprintd;
      })
    ];
    modules = [
      ../profiles
      { programs.hyprland.enable = true; }
    ];
  };

  desk = nixosSystem rec {
    folder = "desk";
    system = "x86_64-linux";
    specialArgs = {
	    astal-bar = astal-bar.homeManagerModules.default;
    };
    overlays = [
      (final: prev: {
        btop = prev.btop.override { cudaSupport = true; };
      })
    ];
    modules = [
      ../profiles
      { programs.hyprland.enable = true; }
    ];
  };
}
