# Campus Maintenance UI Inspiration Brief

## Recommended Visual Direction

The strongest direction is a **calm campus-operations interface**: deep navy framing, light operational content surfaces, one unmistakable next action, and alert color reserved for exceptional conditions. This keeps the current Campus Maintenance identity but makes the role dashboards feel less like general-purpose cards and more like purpose-built work consoles.

| Inspiration Pattern | Original Campus Maintenance Adaptation | Best Screen |
|---|---|---|
| Dominant next-work card | Place the technician’s next assigned work order above secondary metrics, with location, due context, and a clear **Start work** action. | ICT dashboard |
| Exception-only dark alert area | Use a compact dark-navy security alert panel only when an urgent incident is unresolved; routine security jobs remain on the light work queue. | Security dashboard |
| Compact job timeline | Use a three-step status rail—Assigned, In progress, Resolved—with a clear current step and a short visible progress note. | Request detail |
| Focused ticket creation | Keep the reporting form visually quiet, with one evidence card, a clear urgency selection, and a fixed submit action near the final section. | New request |
| Work-order filtering ribbon | Retain the new administrator controls, but group active filters into a compact “queue lens” summary at the top of wide screens. | Administrator command center |

## Specific Changes Worth Building Next

The first refinement should create a distinct **next assignment** card for ICT technicians. It should use an oversized location/building indicator, the ticket reference, a small due-state label, and a single action. This is inspired by the way field-service interfaces make the day’s most actionable job the visual focal point rather than merely one item in a list. [1]

The Security dashboard should maintain a light operational queue, but display unresolved urgent incidents in a single high-contrast panel with acknowledgement state, location, and a direct escalation action. This adapts the security-operations principle of separating exceptions from ordinary signals, rather than reproducing a cybersecurity layout. [2]

The request detail should evolve toward a compact work-order composition: evidence preview, job history, an active status rail, and one role-specific next action. The field-service and work-order references support a simple sequence of context, progress, and completion action. [1] [3]

## Guardrails

The review should inform **original implementation only**. Do not reuse Dribbble screenshots, source illustrations, branded visual assets, or exact layouts. Preserve the Campus Maintenance navy and operational blue, communicate every status with text and color, and maintain the English, Shona, and Ndebele language workflow.

## Prioritized UI Backlog

| Priority | Original Enhancement | Outcome |
|---|---|---|
| 1 | Add a “Next ICT assignment” hero card and “Urgent Security alert” hero card. | Faster role-specific scanning and action. |
| 2 | Replace the request-detail timeline with a clear active status rail. | Better task-progress comprehension. |
| 3 | Add a building/location mini-context block to job detail. | Stronger campus-specific sense of place. |
| 4 | Summarize administrator filters as an active “queue lens.” | Faster interpretation of filtered work. |

## References

[1]: https://dribbble.com/shots/25839605-Field-Service-app-UI-Design "Field Service app UI Design — Dribbble"
[2]: https://dribbble.com/tags/operations-dashboard "Operations Dashboard — Dribbble"
[3]: https://dribbble.com/tags/maintenance-management "Maintenance Management — Dribbble"
