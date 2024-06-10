{
  general = {
    disable_loading_bar = true;
    grace = 2;
    hide_cursor = true;
    ignore_empty_input = true;
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

      swap_font_color = false;
      font_color = "rgb(223, 175, 175)";

      check_color = "rgba(198, 150, 150, 0.1)";
      fail_color = "rgba(250, 100, 100, 0.1)";
      inner_color = "rgba(0, 0, 0, 0)";

      outline_thickness = 0;
      placeholder_text = "";
    }
  ];
}
