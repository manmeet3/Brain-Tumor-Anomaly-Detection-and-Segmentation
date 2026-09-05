# NeuroSignal Frontend

Angular + Ionic client for the web platform. Provides role-specific dashboards (technician, radiologist, admin), MRI upload, a NIfTI viewer (via Papaya) for reviewing scans, and result tables.

## Structure

```
src/app/
├── board-admin/         # Admin dashboard
├── board-radiologist/    # Radiologist review dashboard
├── board-tecnician/      # Technician upload/dashboard
├── login/, register/     # Auth flows
├── nifti/                # NIfTI (.nii/.nii.gz) scan viewer
├── table/                # Patient/scan result tables
├── profile/, home/, header/, footer/, folder/, generic/, material/
└── services/             # API clients for the backend
```

## Running

```bash
npm install
ng serve --port 8080
```

Configure the backend API URL in `src/environments/environment.ts` (development) and `environment.prod.ts` (production).

## Testing

```bash
ng test   # unit tests (Karma/Jasmine)
ng e2e    # end-to-end tests
```
