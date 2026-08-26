# Campus Maintenance Backend Audit

## Existing Foundation

The project already has a MySQL/Drizzle persistence layer, Manus OAuth, protected tRPC procedures, file storage for uploaded evidence, account role profiles, notification preference records, building-coordinate records, and an SLA due timestamp. The current backend can create authenticated requests, list requests visible to the caller, route work, append updates, set technician arrival times, acknowledge incidents, save resolution feedback, persist role profiles, persist notification preferences, and return approved building data.

## Persistence Gap

The primary application state is still initialized from a demonstration request list. Authenticated server data is queried in isolated UI surfaces, but the shared maintenance store does not hydrate its core queue from `maintenance.list`, and local changes do not consistently invoke protected mutations. This prevents account-backed requests from becoming the single source of truth in normal workflows.

## Completion Approach

The backend upgrade will add role-aware helper checks to protected mutations, a structured operational analytics API, and a small client synchronization layer. The application will retain demonstration data only for signed-out preview mode. After sign-in, the shared request store will hydrate from the protected API, create requests through the server, and refresh its cache after mutations. This preserves the existing role-specific UI while making authenticated activity persistent.
