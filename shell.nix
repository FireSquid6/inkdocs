# If you're a non-nix user, you'll need:
# - bun (whatever the latest version is)
# - node js version 20
# - flyctl (if you plan on deploying to fly.io)
# - libgcc is just there because some neovim plugins need it
let
  unstable = import (fetchTarball https://nixos.org/channels/nixos-unstable/nixexprs.tar.xz) { };
in
{ nixpkgs ? import <nixpkgs> { } }:
with nixpkgs; mkShell {
  buildInputs = [
    unstable.bun
    nodejs_20
    flyctl
    libgcc

    # optional if you want to make videos
    asciinema-agg
    asciinema
  ];
}
