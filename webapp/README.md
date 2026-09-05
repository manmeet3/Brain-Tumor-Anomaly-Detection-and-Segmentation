# NeuroSignal Web Platform

The end-user application that puts the anomaly detection and segmentation models in front of hospital technicians and radiologists. A technician uploads a patient's MRI; the platform runs it through the model pipeline and presents a preliminary result for a radiologist to confirm or override.

See the [system architecture diagram](../documents/assets/web-architecture.png) and [screenshot](../documents/assets/webapp-screenshot.jpeg) in the root [README](../README.md#system-architecture).

## Structure

| Folder | Stack | Role |
|---|---|---|
| [`backend/`](backend) | Node.js, Express, MongoDB | REST API — auth, roles (technician/radiologist/admin), scan upload, and results storage |
| [`frontend/`](frontend) | Angular + Ionic | Web client — upload flow, patient/scan tables, radiologist review UI, NIfTI viewer |

## Running locally

Start the backend first, then the frontend:

```bash
# Backend (API), from webapp/backend
npm install
node server.js          # serves on port 8080 by default

# Frontend (client), from webapp/frontend
npm install
ng serve --port 8080
```

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for details specific to each service.
