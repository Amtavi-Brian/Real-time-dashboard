# Columbus People Intelligence

Responsive HR time and wage analytics frontend built with React, Vite, Tailwind CSS, Recharts, Axios, React Router, and the native WebSocket API.

## Setup

From this directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. In mock mode, sign in with one of these accounts (password: `columbus-demo`):

| Email | Assigned role |
| --- | --- |
| `jordan.mensah@columbus.co.gh` | `ADMIN` |
| `ama.osei@columbus.co.gh` | `HR_MANAGER` |
| `kwame.mensah@columbus.co.gh` | `MANAGER` |

The role is assigned by authentication and cannot be selected on the login form. Settings is available only to ADMIN and HR_MANAGER.

## Environment

Copy `.env.example` to `.env` and set the backend URLs when connecting to FastAPI:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_USE_MOCK` | `true` | Use local mock responses and simulated WebSocket pushes. Set to `false` for the real backend. |
| `VITE_API_URL` | `http://localhost:8000` | Axios API base URL. |
| `VITE_WS_URL` | derived from API URL | WebSocket URL; defaults to the API host with `/ws/dashboard`. |

The API paths and expected mock response shapes are centralized in `src/services/api.js`. The real API should return `{ access_token, user: { name, email, role } }` from `/auth/login` and `{ items, total }` for list endpoints. Axios attaches the stored JWT and clears the session after a 401 response.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally.
- `npm run lint` runs ESLint.

## Mock And Real-Time Mode

Mock mode is enabled unless `VITE_USE_MOCK=false`. It serves representative employee, attendance, leave, overtime, payroll, department, and alert data. A simulated WebSocket message updates dashboard metrics and chart series every 12 seconds and periodically adds an alert. The connection status is visible in the top bar.

For the backend, set `VITE_USE_MOCK=false`, configure `VITE_API_URL` and `VITE_WS_URL`, then restart Vite. The socket reconnects with exponential backoff and closes on unmount. Reports export to CSV; the PDF/Print action uses the browser print dialog, where users can choose Save as PDF.