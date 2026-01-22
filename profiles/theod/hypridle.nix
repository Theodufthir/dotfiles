{
  general = {
    before_sleep_cmd = "loginctl lock-session";
    after_sleep_cmd = "hyprctl dispatch dpms on"; # avoid pressing key twice (wakeup + turn on screen)
    lock_cmd = "pidof hyprlock || hyprlock -q --grace 5";
    ignore_dbus_inhibit = false;
  };

  listener = [
    {
      timeout = 240;
      on-timeout = "hyprctl hyprsunset gamma 50";
      on-resume = "hyprctl hyprsunset gamma 100";
    }
    {
      timeout = 300;
      on-timeout = "loginctl lock-session";
    }
    {
      timeout = 420;
      on-timeout = ''[ "$(playerctl status)" = "Playing" ] || systemctl suspend-then-hibernate'';
    }
  ];
}
