# SLA, Export, and Search Assistance Specification

## SLA Deadline Treatment

Campus Maintenance will display a **configurable operational SLA target** on open requests. Until the institution provides approved service-level policy, the application labels the rule as a configurable target rather than a contractual deadline. The initial priority targets are one hour for Urgent, four hours for High, two working days for Medium, and five working days for Low. A request card will show an amber warning when its target is close and a red breach state when overdue. Resolved requests do not show a deadline alert.

## Analytics CSV Export

The administrator Analytics page will export a UTF-8 CSV file that contains the current performance summary, team workload table, and explicit export timestamp. The export should use the same in-memory request data as the KPI and chart surfaces, so the file accurately reflects the visible operational workspace. The action is web-first and must show clear feedback if download is unavailable on a non-web runtime.

## Search Assistance

Global search will surface direct matches while the user types and retain a short local history of chosen queries. Suggestions will combine recent query labels with matching requests and verified buildings, respect the role-permitted request dataset, and avoid exposing buildings until the user has signed in.
