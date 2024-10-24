# If you're a non-nix user, you'll need:
# - bun (whatever the latest version is)
# - node js version 20
# - flyctl (if you plan on deploying to fly.io)
# - libgcc is just there because some neovim plugins need it

# Help! I'm a nix user and it isn't working!
#
# try running these commands:
# sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
# sudo nix-channel --update
# then run nix-shell again

let
  unstable = import <nixos-unstable> { config = { allowUnfree = true; }; };
in
{ nixpkgs ? import <nixpkgs> { } }:
with nixpkgs; mkShell {
  DOCKER_BUILDKIT = "1";
  buildInputs = [
    unstable.bun
    nodejs_20
    flyctl
    libgcc
    typescript-language-server
    typescript
    nodePackages.typescript-language-server
    tailwindcss
    tailwindcss-language-server
    # optional if you want to make videos
    # asciinema-agg
    # asciinema
  ];
}
