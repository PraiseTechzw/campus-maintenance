# Production-Readiness Audit

## Static Operational Data Identified

The previous implementation retained a signed-out demonstration workspace with seeded requests, fixed staff names, local request identifiers, and role-preview navigation. Several presentation surfaces also used location fallbacks that named a specific building even when no verified campus location was available. These behaviors are unsuitable as a live institutional service because they can be mistaken for real work records or staff assignments.

## Remediation Plan

Signed-out sessions will no longer receive seeded requests or role-specific workspaces. The shared store will expose only authenticated backend data and explicit loading, empty, and failure states. Staff will be drawn from registered institutional accounts with persisted operational roles; an administrator will assign requests to a compatible person rather than a preset name. Campus locations and SLA targets will be administered as verified records, not substituted from example values.

## External Inputs Still Required

The institution must provide its approved operational role assignments, official campus building coordinates, and official SLA policy values before the service can be considered institution-configured. The application will provide secure controls to enter and maintain those records without inventing them.
