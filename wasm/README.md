# MBColumn Lite full-feature WebAssembly migration

**Status: WIP, not deployed.** This branch stores native-C WASM building blocks and a reproducible build/smoke test. It does NOT yet replace the private Render solver.

Build locally: `cd wasm && sh build.sh` (clang/wasm-ld and Node 20+).

Architecture target:
1. A compiled native WASM engine owns EC2 stress laws, strain planes, rectangular fibre integration, neutral-axis sweep, PMM interaction mesh, ray/surface intersections, Newton exact refinement, 2D interaction curves, creep and nominal curvature slenderness.
2. Browser Web Worker loads WASM off main thread; high-volume arrays move through WASM linear memory.
3. GitHub Pages frontend retains section drawing, load cases, Calculate button, 3D/2D charts and PDF/HTML reports.
4. All numbers and acceptance criteria must match baseline fixtures for the original JavaScript solver; no reduction of mesh quality, and cover high-strength concrete, different aspect ratios, compression/tension edges, bundled bars and slenderness.
5. Only after numerical parity and integration tests switch GitHub Pages to local computation, remove API requests and discontinue Render.

**Security:** WASM is not encrypted and can be reverse engineered. Native source stays private; public browser receives binary only.

## Gap checklist
- [x] Port native rectangular fibre resultant kernel and build script
- [ ] Stable memory ABI, bar allocation, error handling
- [ ] Neutral-axis state sweep and EC2 compression domain
- [ ] 3D triangulation and radial D/C intersection with Newton refinement
- [ ] P-M and Mx-My curves and 3D chart data
- [ ] EC2 creep and slenderness
- [ ] Browser Worker and all UI feature parity
- [ ] Cross-platform baselines and performance regression
- [ ] Public staged deployment, then cutover
