# WASM migration (experimental)

This is a migration work branch only. The public website must not switch away from the Render API until the complete solver is migrated and verified.

Completed locally: a native WASM implementation of EC2 Annex B creep coefficient, checked against equivalent JS calculations for three inputs. Binary, C source and test are available in the conversation as `MBColumnLite-WASM-Proof-of-Concept.zip`.

Not migrated: fibre PMM integration, full interaction surface, D/C radial check and exact refinement, moment/contour charts, slenderness. Never release a pseudo-WASM wrapper that merely exposes the JS solver source. WASM can be reverse engineered.
