#!/bin/sh
set -eu
clang --target=wasm32 -O3 -nostdlib -Wl,--no-entry -Wl,--export-memory -Wl,--initial-memory=131072 -Wl,--max-memory=131072 -Wl,--allow-undefined -o fibre.wasm fibre.c
node verify.mjs
