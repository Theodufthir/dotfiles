{
  general = {
    ignore_empty_input = true;
    fail_timeout = 1000;
  };

  background = [
    {
      path = "screenshot";

      blur_passes = 3;
      blur_size = 5;
    }
  ];

  input-field = [
    {
      size = "300, 60";
      position = "0, 0";

      dots_spacing = "0.3";
      dots_center = true;

      swap_font_color = true;
      font_color = "rgba(255, 255, 255, 0.8)";

      check_color = "rgba(255, 255, 255, 0.2)";
      fail_color = "rgba(250, 100, 100, 0.8)";
      inner_color = "rgba(0, 0, 0, 0)";

      outline_thickness = 0;
      placeholder_text = "";
    }
  ];

  label = [
    { # Time indicator
      text = "$TIME";
      font_family = "0xProto Nerd Font";
      color = "rgba(255, 255, 255, 0.8)";
      font_size = 100;
      position = "0,15%";
    }

    {
      text = ''cmd[update:1000] echo "$(playerctl metadata xesam:title) - $(playerctl metadata xesam:artist)" || echo ""'';
      font_family = "0xProto Nerd Font";
      color = "rgba(255, 255, 255, 0.5)";
      position = "0,-2%";
      halign = "center";
      valign = "top";
      onclick = "playerctl play-pause";
    }
  ];
}
