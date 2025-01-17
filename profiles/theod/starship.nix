let
  osStyle = {
    style = "bg:color_orange fg:color_fg0";
  };
  dirStyle = {
    style = "fg:color_fg0 bg:color_yellow";
  };
  gitStyle = {
    style = "fg:color_fg0 bg:color_aqua";
  };
  languageStyle = {
    style = "fg:color_fg0 bg:color_blue";
    format = "[ $symbol( $version) ]($style)";
  };
  envStyle = {
    style = "fg:#83a598 bg:color_bg3";
  };
in
{
  "$schema" = "https://starship.rs/config-schema.json";

  format = builtins.concatStringsSep "" [
    "[](color_orange)"
    "$os" "$username"
    "[](bg:color_yellow fg:color_orange)"
    "$directory"
    "[](fg:color_yellow bg:color_aqua)"
    "$git_branch" "$git_status"
    "[](fg:color_aqua bg:color_blue)"
    "$c" "$rust" "$golang" "$nodejs" "$php" "$java" "$kotlin" "$haskell" "$python"
    "[](fg:color_blue bg:color_bg3)"
    "$nix_shell" "$docker_context" "$conda"
    "[](fg:color_bg3)"
    /*
    "[](fg:color_bg3 bg:color_bg1)"
    "$time"
    "[ ](fg:color_bg1)"
    */
    "$line_break$character"
  ];

  palette = "gruvbox_dark";

  palettes.gruvbox_dark = {
    color_fg0 = "#fbf1c7";
    color_bg1 = "#3c3836";
    color_bg3 = "#665c54";
    color_blue = "#458588";
    color_aqua = "#689d6a";
    color_green = "#98971a";
    color_orange = "#d65d0e";
    color_purple = "#b16286";
    color_red = "#cc241d";
    color_yellow = "#d79921";
  };

  os = osStyle // {
    disabled = false;

    symbols = {
      Windows = "󰍲";
      Ubuntu = "󰕈";
      SUSE = "";
      Raspbian = "󰐿";
      Mint = "󰣭";
      Macos = "󰀵";
      Manjaro = "";
      Linux = "󰌽";
      Gentoo = "󰣨";
      Fedora = "󰣛";
      Alpine = "";
      Amazon = "";
      Android = "";
      Arch = "󰣇";
      Artix = "󰣇";
      EndeavourOS = "";
      CentOS = "";
      Debian = "󰣚";
      Redhat = "󱄛";
      RedHatEnterprise = "󱄛";
      Pop = "";
      NixOS = "";
    };
  };

  username = {
    show_always = true;
    style_user = osStyle.style;
    style_root = osStyle.style;
    format = "[ $user ]($style)";
  };

  directory = dirStyle // {
    format = "[ $path$read_only ]($style)";
    read_only = " ";
    truncation_length = 3;
    truncation_symbol = "…/";
  };
    
  git_branch = gitStyle // {
    symbol = "";
    format = "[ $symbol $branch ]($style)";
  };
    
  git_status = gitStyle // {
    format = "[($all_status$ahead_behind) ]($style)";
  };
    
  nodejs = languageStyle // {
    symbol = "";
  };
    
  c = languageStyle // {
    symbol = " ";
  };
    
  rust = languageStyle // {
    symbol = "";
  };
    
  golang = languageStyle // {
    symbol = "";
  };
    
  php = languageStyle // {
    symbol = "";
  };
    
  java = languageStyle // {
    symbol = "";
  };
    
  kotlin = languageStyle // {
    symbol = "";
  };
    
  haskell = languageStyle // {
    symbol = "";
  };
    
  python = languageStyle // {
    symbol = "";
  };
    
  docker_context = envStyle // {
    symbol = "";
    format = "[ $symbol $context]($style)";
  };

  nix_shell = envStyle // {
    symbol = "";
    format = "[ $symbol $state $name]($style)";
  };
    
  conda = envStyle // {
    format = "[ $symbol $environment]($style)";
  };
    
  time = {
    disabled = true;
    time_format = "%R";
    style = "bg:color_bg1";
    format = "[[   $time](fg:color_fg0 bg:color_bg1)]($style)";
  };
    
  line_break = {
    disabled = false;
  };
    
  character = {
    disabled = false;
    success_symbol = "[](bold fg:color_green)";
    error_symbol = "[](bold fg:color_red)";
    vimcmd_symbol = "[](bold fg:color_green)";
    vimcmd_replace_one_symbol = "[](bold fg:color_purple)";
    vimcmd_replace_symbol = "[](bold fg:color_purple)";
    vimcmd_visual_symbol = "[](bold fg:color_yellow)";
  };
}
