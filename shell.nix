with (import <nixpkgs> { });
with (import <nixpkgs.unstable> { });
mkShell {
  buildInputs = [
    nodejs_20
    bun
    flyctl
  ];
}

