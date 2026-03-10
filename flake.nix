{
  description = "Dev shell for HackUDC 2026";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";

    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_25

              docker
              docker-compose

              pyright

              (python314.withPackages(pp: [
              pp.pypdf
              pp.requests
              pp.psycopg2
              pp.cffi
              pp.packaging
              pp.pillow
              pp.pycparser
              pp.python-multipart
              pp.fastapi
              pp.uvicorn
              ]))
            ];
          };
        };
    };
}
