# MBColumnLite private computation API

Keep this repository PRIVATE. Deploy as Node.js 20+ web service (start command: `npm start`). Set `ALLOWED_ORIGINS=https://Anhbq1298.github.io` and use your service URL in the public frontend. Health: `GET /health`. Routes: `POST /api/analyse`, `/api/creep`, `/api/slenderness`.

This is the JavaScript port of the solver, moved server-side; it is not yet a C#/.NET 8 API. Validate calculation baseline before production. CORS is not authentication. Add authenticated access and stronger rate controls before heavy public use.
