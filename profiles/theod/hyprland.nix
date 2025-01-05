{
  settings = {
    "$orange" = "rgba(ee8844ee)";
    "$pink" = "rgba(ff2277ee)";
    "$violet" = "rgba(9966ffee)";
    "$mod" = "SUPER";
    "$super_press_delay" = 180; # in milliseconds

    debug = {
      #damage_tracking = 0; # Only activate if shader needs it
    };
    
    monitor = [
      "desc:Samsung Display Corp. 0x417A,preferred,auto,2"
      "desc:AOC Q24G2 ZQVQ3HA005748,preferred,auto-left,1.25"
      "desc:Samsung Electric Company U32J59x HNMW800784,preferred,auto-left,1.5"
      "desc:Samsung Electric Company U32J59x HNMW800791,preferred,auto-right,1.5"
      "desc:Invalid Vendor Codename - RTK RTK QHD HDR demoset-1,preferred,auto-left,1.6"
      "desc:LG Electronics LG TV SSCR2 0x01010101,preferred,auto-up,3"
      ",preferred,auto,auto"
    ];

    windowrulev2 = [
      "opacity 0.9 0.7 1, class:(kitty|foot)"
      "bordercolor $orange, tag:resize"
      #"suppressevent maximize, class:.*" # You'll probably like this.
    ];

    layerrule = [
      "blur, eww.*-blur.*"
      "blurpopups, (eww.*-blur.*|eww-bar)"
      "animation slide, (.*)"
    ];

    exec-once = [
      "ags &> /tmp/ags_logs"
      "brightnessctl -r"
      "iio-hyprland" #tofix
    ];

    # Some default env vars.
    env = [
      "XCURSOR_SIZE,24"
      "HYPRCURSOR_SIZE,24"
    ];

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
      border_size = 1;
      "col.active_border" = "$orange $pink $violet $violet $violet $pink $orange 45deg";
      "col.inactive_border" = "rgba(9966ff55)";

      layout = "dwindle";
      
      allow_tearing = false;
    };

    xwayland = {
      force_zero_scaling = true;
    };

    decoration = {
      rounding = 15;

      blur = {
          enabled = true;
          size = 8;
          passes = 2;
      };

      shadow = {
        enabled = false;
      };

      screen_shader = "/home/theod/.config/hypr/screen_shader.frag";
    };

    animations = {
      enabled = "yes";

      # Some default animations, see https://wiki.hyprland.org/Configuring/Animations/ for more
      bezier = [
        "linear, 0, 0, 1, 1"
        "fading, 0.19, 1, 0.22, 1"
        "bounce_out, 0.175, 0.885, 0.32, 1.275"
        "boing, 0.3, 2.5, 0.44, 0.16"
        "fade_out, 0.8, 0.2, 0.9, 0.4"
      ];

      animation = [
        "windows, 1, 7, fading, slide"
        "border, 1, 10, default"
        "borderangle, 0, 20, linear, loop"
        "fade, 1, 7, fading"
        "fadeIn, 0"
        "fadeOut, 1, 4, fade_out"
        "workspaces, 1, 5, default, slidefade"
      ];
    };

    dwindle = {
      pseudotile = "yes"; # master switch for pseudotiling. Enabling is bound to mod + P in the keybinds section below
      preserve_split = "yes"; # you probably want this
    };

    master = {
      new_status = true;
    };

    gestures = {
      workspace_swipe = "on";
      workspace_swipe_touch = "on";
      workspace_swipe_forever = true;
      workspace_swipe_direction_lock = false;
      workspace_swipe_min_speed_to_force = 10;
    };

    misc = {
      force_default_wallpaper = "-1";
      focus_on_activate = true;
      new_window_takes_over_fullscreen = 2;
      disable_autoreload = true; # I have to rebuild anyways
    };

    bind = [
      # Clients
      "$mod, Return, exec, foot"
      "$mod SHIFT, Return, exec, [float] foot"
      "$mod, Q, killactive,"
      
      '', $mod_L, exec, echo "$(($(date +%s%3N) + $super_press_delay))" > /tmp/hyprland_super_timestamp''
      ''$mod SHIFT, S, exec, mkdir ~/screenshots; path=~/screenshots/"$(date '+%s').png"; grimblast copysave output "$path" && satty -f "$path" --fullscreen''
      # Power/locking
      "$mod SHIFT, E, exit,"
      "$mod SHIFT, L, exec, loginctl lock-session"
      "$mod SHIFT, P, exec, systemctl suspend-then-hibernate"
      "$mod CTRL, P, exec, systemctl hibernate"
      
      # Disposition
      "$mod, V, togglefloating,"
      "$mod, P, pseudo,"
      "$mod, J, togglesplit,"
      "$mod, F, fullscreen,"
      "$mod SHIFT, F, fullscreenstate, -1 3"
      "$mod CTRL, F, fullscreen, 1"
      "$mod SHIFT, SPACE, centerwindow,"
      "$mod SHIFT, V, focuswindow, floating" 
      "$mod, TAB, changegroupactive, forward"
      "$mod SHIFT, TAB, changegroupactive, back"
      "$mod, G, togglegroup"

      # Workspaces
      "$mod, ESCAPE, togglespecialworkspace, magic"
      "$mod SHIFT, ESCAPE, movetoworkspacesilent, special:magic"
      "$mod CTRL, ESCAPE, movetoworkspace, special:magic"
      "$mod, mouse_down, workspace, e+1"
      "$mod, mouse_up, workspace, e-1"
    ] ++ (
      builtins.concatLists (
        map (
          n: let code = "code:${toString (n + 10)}"; number = toString (n + 1); in [
            "$mod, ${code}, workspace, ${number}"
            "$mod SHIFT, ${code}, movetoworkspacesilent, ${number}"
            "$mod ALT, ${code}, focusworkspaceoncurrentmonitor, ${number}"
            "$mod CTRL, ${code}, movetoworkspace, ${number}"
          ]
        )
        (builtins.genList (x: x) 9)
      )
    ) ++ (
      builtins.concatLists (
        map (
          dir: let letter = (builtins.substring 0 1 dir); in [
            "$mod, ${dir}, movefocus, ${letter}"
            "$mod SHIFT, ${dir}, movewindoworgroup, ${letter}"
            "$mod CTRL, ${dir}, swapwindow, ${letter}"
          ]
        )
        [ "left" "right" "up" "down" ]
      )
    );


    # Release binds
    bindr = [
      ''$mod, $mod_L, execr, [ "$(date +%s%3N)" -ge "$(cat /tmp/hyprland_super_timestamp)" ] || pkill wofi || wofi --show drun''
    ];

    # Repeated binds
    binde = [
      "$mod ALT, right, resizeactive, 10 0"
      "$mod ALT, left, resizeactive, -10 0"
      "$mod ALT, up, resizeactive, 0 -10"
      "$mod ALT, down, resizeactive, 0 10"
    ];

    # Repeated+locked binds
    bindel = [
      # Brightness
      ", XF86MonBrightnessUp, exec, brightnessctl --exponent=5 -s s +5%"
      ", XF86MonBrightnessDown, exec, brightnessctl --exponent=5 -sn s 5%-"

      # Volume
      ", XF86AudioRaiseVolume, exec, amixer sset Master 2%+ "
      ", XF86AudioLowerVolume, exec, amixer sset Master 2%-"
    ];

    # Locked binds
    bindl = [ 
      # Mute
      ", XF86AudioMicMute, exec, amixer --default-source -m"
      ", XF86AudioMute, exec, amixer sset Master toggle"
      
      # Player controls
      ", XF86AudioPlay, exec, playerctl play"
      ", XF86AudioPause, exec, playerctl pause"
      ", XF86AudioNext, exec, playerctl next"
      ", XF86AudioPrev, exec, playerctl previous"
    ];

    # Mouse binds
    bindm = [
      "$mod, mouse:272, movewindow"
      "$mod, mouse:273, resizewindow"
    ];
  };

  extraConfig = "";
}
