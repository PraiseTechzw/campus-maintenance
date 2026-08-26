# Campus Maintenance Application Completion Audit

## Core Journey Status

The app already supports role-based dashboard views, reporting, request details, technician updates, security acknowledgement, photo evidence, activity history, filters, and profile settings. The remaining work will turn these features into a more complete end-to-end application journey rather than isolated screens.

## Required Additions

| Area | Addition | User Outcome |
|---|---|---|
| Authentication | Dedicated welcome/sign-in screen with role-aware demonstration entry and the existing live account provider. | Clear entry point before app navigation. |
| Technician arrival time | Technician enters an expected arrival or completion time from the request detail. | Students see an ETA based on a technician decision rather than a fixed rule. |
| Campus map | Tapping the hero maintenance pin opens a location sheet with building, area, access guidance, and active-report context. | The visual map becomes useful operational context. |
| Activity filters | Filter updates by all activity, assignments, progress, resolutions, and urgent/security items. | Faster scanning through many updates. |
| Missing screens | Add notification preferences and a location-detail sheet route or modal, while keeping profile, request, and role selection journeys connected. | More complete application coverage without dead ends. |

## Role Journeys To Validate

Students must be able to enter through the welcome screen, report an issue, view the technician-entered ETA, open the map location detail, and filter their updates. Technicians must be able to access assigned work, enter or revise the ETA, post a progress note, and resolve a job. Security staff must be able to acknowledge urgent incidents and view focused alert history. Administrators must retain routing and queue filtering access. Authentication is required for the live account path, while demonstration roles remain available for controlled walkthroughs.
