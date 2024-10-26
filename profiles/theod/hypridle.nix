{
  general = {
    before_sleep_cmd = "loginctl lock-session";
    after_sleep_cmd = "hyprctl dispatch dpms on"; # avoid pressing key twice (wakeup + turn on screen)
    lock_cmd = "pidof hyprlock || hyprlock -q";
    ignore_dbus_inhibit = false;
  };

  listener = [
    {
      timeout = 240;
      on-timeout = "b=$(brightnessctl g); brightnessctl -s set $((b/5+1))";
      on-resume = "brightnessctl -r";
    }
    {
      timeout = 300;
      on-timeout = "loginctl lock-session";
    }
    {
      timeout = 420;
      on-timeout = ''[ "$(playerctl status)" = "Playing" ] || systemctl suspend'';
    }
    # Maybe see if sleep-then-hibernate or fully hibernate is worth
  ];
}
