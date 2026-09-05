# NeuroSignal Backend

Node.js/Express REST API for the web platform. Handles authentication, role-based access (technician, radiologist, admin), MRI scan uploads, and persistence of scan metadata and processed results via MongoDB.

## Structure

```
app/
├── config/        # Auth (JWT) and app config
├── controllers/   # Route handlers: auth, login, register, radiologist, user, user-state
├── middlewares/   # JWT verification, sign-up validation
├── models/        # Mongoose schemas: admin, patient, radiologist, role, scan, technician
└── routes/        # Express route definitions
uploads/           # Incoming MRI uploads (runtime, gitignored contents recommended)
processedmris/     # Model output staged for the frontend
```

## Running

```bash
npm install
cp .env.example .env   # then set JWT_SECRET to a long random string
node server.js
```

The server listens on `PORT` (default `8080`) and exposes routes under `/api/auth`, plus technician and radiologist endpoints (see `app/routes/`).

## Configuration

`app/config/auth.config.js` reads the JWT signing secret from the `JWT_SECRET` environment variable (loaded from `.env` via `dotenv`, which is gitignored) rather than a hardcoded value. Set your own secret in `.env` before starting the server — the process will sign tokens with `undefined` if it's missing, so requests will fail auth until it's set.

> **Note:** `server.js` still contains a hardcoded MongoDB Atlas connection string. Before deploying or publishing this repo publicly, move it into an environment variable (e.g. `MONGODB_URI` in `.env`) the same way the JWT secret was handled above.
