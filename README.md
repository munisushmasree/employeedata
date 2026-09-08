 # Employee Offboarding Automation

This project digitizes employee exit initiation, configurable clearance stages, role-based approvals, remarks, and audit history.

## Run locally

1. Start MongoDB on `mongodb://127.0.0.1:27017`.
2. Start the API:

	```text
	cd backend
	npm install
	npm run start:dev
	```

3. Start the frontend in another terminal:

	```text
	cd frontend
	npm install
	npm run dev
	```

## Workflow API

- `POST /api/offboarding` starts a case using the saved approval chain.
- `GET /api/offboarding/view/hr`, `/finance`, or `/manager` returns a role view.
- `PATCH /api/offboarding/:id` accepts `stageKey`, `status`, `remarks`, `userName`, and `role`.
- `GET /api/offboarding/:id/audit` returns the immutable activity history.
- `GET /api/offboarding/workflow/config` reads the global chain.
- `PATCH /api/offboarding/workflow/config` with `{ "stages": [...] }` updates the chain for new cases.

The default chain runs Manager, Admin & Systems, Accounts, and Personnel in parallel, followed by HR final clearance.
