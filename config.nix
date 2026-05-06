{
  plugins = {
    lsp = {
      enable = true;
      servers = {
        # Web
        ts_ls.enable = true;
        html.enable = true;
        cssls.enable = true;
        # DevOps
        dockerls.enable = true;
        # Scripting
        bashls.enable = true;
        lua_ls.enable = true;
        # .enable = true;
        pyright.enable = true;
      };
    };

    cmp = {
      enable = true;
      settings = {
        sources = [
          { name = "path"; }
          { name = "nvim_lsp"; }
          { name = ""; }
        ];
        mapping = {
          "<Tab>" = "cmp.mapping.confirm()";
          "<Esc>" = "cmp.mapping.close()";
          "<Up>" = "cmp.mapping.select_prev_item()";
          "<Down>" = "cmp.mapping.select_next_item()";
        };
        preselect = "cmp.PreselectMode.Item";
        completion.completeopt = "menu,menuone,noinsert";
      };
    };

    nvim-autopairs.enable = true; # Check emmet

    neo-tree = { # TODO setup files
      enable = true;
      settings = {
        enableGitStatus = true;
        enableModifiedMarkers = true;
        enableRefreshOnWrite = true;
        enableDiagnostics = true;
        closeIfLastWindow = true;
        buffers = {
          bindToCwd = false;
          followCurrentFile = {
            enabled = true;
          };
        };
        followCurrentFile = {
          enabled = true;
          leaveDirsOpen = true;
        };
        commands = {
          unfocus.__raw = ''function(state) vim.cmd.wincmd("p") end'';
        };
        window = {
          mappings = {
            "<esc>" = "unfocus";
          };
        };
      };
    };

    oil = {
      enable = true; # TODO check
      settings = {
        skip_confirm_for_simple_edits = true;
        view_options.show_hidden = true;
      };
    };

    telescope = {
      enable = true;
      keymaps = {
        "<leader>ff" = "find_files";
        "<leader>fg" = "live_grep";
        "<leader>fb" = "buffers";
        "<leader>fd" = "diagnostics";
      };
    };

    lualine.enable = true;
    bufferline.enable = false;
    barbar = {
      enable = true;
      keymaps = {
        next.key = "<A-Tab>";
        previous.key = "<S-A-Tab>";
        close.key = "<A-q>";
      };
    };

    web-devicons.enable = true;
    smear-cursor.enable = true;
  };
  
  dependencies = {
    ripgrep.enable = true;
  };

  globals.mapleader = " ";
  opts = {
    number = true;
    relativenumber = true;

    tabstop = 2;
    shiftwidth = 2;
    expandtab = true;
    smartindent = true;
  };

  keymaps = [
    {
      action = "<cmd>Neotree right focus reveal<CR>";
      key = "<leader>t";
      mode = ["n"];
    }
    # Indentation
    {
      action = "<gv";
      key = "<S-Tab>";
      mode = ["v"];
    }
    {
      action = ">gv";
      key = "<Tab>";
      mode = ["v"];
    }
    {
      action = "<cmd><<CR>";
      key = "<S-Tab>";
      mode = ["i"];
    }
  ];

  colorscheme = "catppuccin";

  colorschemes = {
    everforest.enable = true;
    catppuccin.enable = true;
    tokyonight.enable = true;
    gruvbox.enable = true;
    dracula.enable = true;
  };
}
