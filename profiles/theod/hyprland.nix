{
  monitor = [
    "HDMI-A-1,preferred,-1440x0,auto"
    "eDP-1,2880x1800@60,auto,auto"
    ",preferred,auto,auto"
  ];


  exec-once = [
    "eww daemon && eww open bar --screen 0 --id 0"
    "brightnessctl -r"
  ];

  # Source a file (multi-file configs)
  # source = "~/.config/hypr/myColors.conf";

  # Some default env vars.
  env = "XCURSOR_SIZE,24";

  # For all categories, see https://wiki.hyprland.org/Configuring/Variables/
  input = {
    kb_layout = "fr";
    follow_mouse = 1;
    sensitivity = 0;
    touchpad.natural_scroll = "yes";
    touchdevice.output = "eDP-1";
    tablet.output = "eDP-1";
  };

  general = {
    gaps_in = 5;
    gaps_out = 10;
    border_size = 3;
    "col.active_border" = "rgba(ee8844ee) rgba(ff2277ee) rgba(9966ffee) 15deg";
    "col.inactive_border" = "rgba(595959aa)";

    layout = "dwindle";

    # Please see https://wiki.hyprland.org/Configuring/Tearing/ before you turn this on
    allow_tearing = false;
  };

  decoration = {
    # See https://wiki.hyprland.org/Configuring/Variables/ for more

    rounding = 15;

    blur = {
        enabled = true;
        size = 3;
        passes = 1;
    };

    drop_shadow = "yes";
    shadow_range = 4;
    shadow_render_power = 3;
    "col.shadow" = "rgba(1a1a1aee)";
  };

  animations = {
    enabled = "yes";

    # Some default animations, see https://wiki.hyprland.org/Configuring/Animations/ for more
    bezier = "myBezier, 0.05, 0.9, 0.1, 1.05";

    animation = [
      "windows, 1, 7, myBezier"
      "windowsOut, 1, 7, default, popin 80%"
      "border, 1, 10, default"
      "borderangle, 1, 8, default"
      "fade, 1, 7, default"
      "workspaces, 1, 6, default"
    ];
  };

  dwindle = {
    # See https://wiki.hyprland.org/Configuring/Dwindle-Layout/ for more
    pseudotile = "yes"; # master switch for pseudotiling. Enabling is bound to mod + P in the keybinds section below
    preserve_split = "yes"; # you probably want this
  };

  master = {
    # See https://wiki.hyprland.org/Configuring/Master-Layout/ for more
    new_is_master = true;
  };

  gestures = {
    # See https://wiki.hyprland.org/Configuring/Variables/ for more
    workspace_swipe = "off";
  };

  misc = {
    # See https://wiki.hyprland.org/Configuring/Variables/ for more
    force_default_wallpaper = "-1"; # Set to 0 to disable the anime mascot wallpapers
  };

# Example windowrule v1
# windowrule = float, ^(kitty)$
# See https://wiki.hyprland.org/Configuring/Window-Rules/ for more

  "$mod" = "SUPER";

  bind = [
    "$mod, Return, exec, kitty"
    "$mod, Q, killactive, "
    "$mod_SHIFT, E, exit, "
    "$mod, E, exec, dolphin"
    "$mod, V, togglefloating, "
    "$mod, R, exec, wofi --show drun"
    "$mod, P, pseudo, # dwindle"
    "$mod, J, togglesplit, # dwindle"
    "$mod, F, fullscreen, # dwindle"
  ] ++ (
    builtins.concatLists (
      map (
        dir: let letter = (builtins.substring 0 1 dir); in [
          "$mod, ${dir}, movefocus, ${letter}"
          "$mod_SHIFT, ${dir}, movewindow, ${letter}"
        ]
      )
      [ "left" "right" "up" "down" ]
    )
  ) ++ (
    builtins.concatLists (
      map (
        n: let code = "code:${toString(n + 9)}"; number = toString n; in [
          "$mod, ${code}, workspace, ${number}"
          "$mod_SHIFT, ${code}, movetoworkspacesilent, ${number}"
          "$mod_SHIFT_CTRL, ${code}, movetoworkspace, ${number}"
        ]
      )
      (builtins.genList (x: x) 10)
    ) 
  ) ++ [
    "$mod, S, togglespecialworkspace, magic"
    "$mod SHIFT, S, movetoworkspace, special:magic"
    
    "$mod, mouse_down, workspace, e+1"
    "$mod, mouse_up, workspace, e-1"

    # Brightness up/down
    ", XF86MonBrightnessUp, exec, brightnessctl s +5%"
    ", XF86MonBrightnessDown, exec, brightnessctl s 5%-"

    # Volume controls
    ", XF86AudioRaiseVolume, exec, amixer sset Master 2%+ "
    ", XF86AudioLowerVolume, exec, amixer sset Master 2%-"
    ", XF86AudioMicMute, exec, amixer --default-source -m"
    ", XF86AudioMute, exec, amixer -t"
    
    # Player controls
    ", XF86AudioPlay, exec, playerctl play"
    ", XF86AudioPause, exec, playerctl pause"
    ", XF86AudioNext, exec, playerctl next"
    ", XF86AudioPrev, exec, playerctl previous"
  ];

  # Move/resize windows with mod + LMB/RMB and dragging
  bindm = [
    "$mod, mouse:272, movewindow"
    "$mod, mouse:273, resizewindow"
  ];
}
