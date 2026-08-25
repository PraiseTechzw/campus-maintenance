# Campus Maintenance — Interface Design Plan

## Product Intent

Campus Maintenance is a mobile-first service desk for the campus community. It lets students report issues in a few taps, routes work to the correct technical team, and gives administrators a clear operational view. The same Expo interface adapts into a responsive website for larger screens, while preserving the fast, one-handed Android workflow.

## Design Direction

The product uses the supplied Campus Maintenance identity as its visual foundation: a **deep navy** operational color, a **bright campus blue** for primary actions, and a clean white surface. The interface should feel dependable and calm, with clear status labels rather than decorative effects. On phones, primary actions sit within thumb reach and forms are broken into short, focused steps. On the responsive website, content expands into comfortable two-column summaries without losing the mobile hierarchy.

| Token | Color | Use |
|---|---:|---|
| Campus Navy | `#082B73` | Headers, critical navigation, primary text |
| Campus Blue | `#1479E8` | Primary buttons, active states, progress indicators |
| Cloud Blue | `#EAF4FF` | Highlight panels and selected filter backgrounds |
| Campus Mist | `#F6F8FC` | App background |
| Success Green | `#138A54` | Resolved status and positive confirmation |
| Attention Amber | `#C97800` | Pending and high-priority status |
| Security Red | `#B42318` | Safety alerts and emergency escalation |

## Screen List

| Screen | Primary Content and Functionality |
|---|---|
| Welcome and role entry | Branded entry point where a user chooses a demo role for the MVP: Student, ICT Technician, Physical-Maintenance Technician, Security, or Administrator. A production sign-in will use the same role model. |
| Student home | Personal overview showing open reports, resolved reports, and an always-visible “Report an issue” action. Recent requests carry clear status chips. |
| New issue report | Guided form for category, location, description, urgency, and optional photo placeholder. Categories include ICT, Plumbing, Electrical, Building, Cleaning, and Security. |
| Request detail | A shared timeline: submitted, assigned, in progress, and resolved. Users can view the assigned team, issue information, and resolution note. |
| Technician work queue | Filtered list of jobs assigned to the active ICT or physical-maintenance technician. Each card includes priority, location, target time, and category. |
| Technician job detail | Job information, reporter note, activity log, and role-appropriate actions: accept, start work, add update, and resolve. |
| Security incident queue | High-visibility queue for security-tagged reports, using red severity signals and clear escalation state. Security staff can acknowledge and update an incident. |
| Administrator command center | Campus-wide analytics summary, live queue by team, priority filters, workload distribution, assignment controls, and an issue list that can route reports to ICT, physical maintenance, or security. |
| Notifications and activity | A compact feed of assignment, status-change, and resolution events. It is available from the dashboard header and as a web-friendly panel. |
| Profile and settings | Role identity, notification preferences, help, and secure sign-out placeholder. |

## Core Role Model

| Role | Permissions and Primary Tasks |
|---|---|
| Student | Submit issues, attach context, review only their own reports, and confirm that a resolution is satisfactory. |
| ICT Technician | View ICT-assigned work, accept jobs, log diagnostic progress, and resolve technology issues. |
| Physical-Maintenance Technician | View plumbing, electrical, building, cleaning, and related work; update progress; and provide the completion note. |
| Security Officer | Access security-tagged incidents, acknowledge urgent issues, add situation updates, and mark handoff or resolution. |
| Administrator | View all reports, assign or reassign work, set priority, monitor workload, review overdue jobs, and oversee resolution quality. |

## Key User Flows

### Student reports an issue

The student opens the home screen, taps **Report an issue**, selects an issue type, identifies the location, writes a short description, chooses a priority, and submits. The system creates a report with the status **Submitted**, displays a confirmation screen, and adds the request to the student’s activity list.

### Administrator routes the request

The administrator opens the command center, selects an unassigned request, checks the category and urgency, and assigns it to ICT, Physical Maintenance, or Security. The request moves to **Assigned** and appears in the relevant specialist queue.

### Technician completes work

The assigned technician opens the job, taps **Start work**, adds a progress update when needed, then records a clear resolution note and marks the issue **Resolved**. The reporter sees the completed timeline and can review the outcome.

### Security handles a safety concern

When a report is classified as Security or Emergency, it appears in the security queue with an elevated alert treatment. A security officer acknowledges the incident, enters an update, and either resolves the issue or records a handoff to another campus service. Administrators retain full visibility.

## Navigation and Responsive Behavior

On Android, the core navigation has four tabs: **Home**, **My Requests or Work Queue**, **Activity**, and **Profile**. The central report action is promoted from the Home screen instead of being buried in a tab. Role-specific actions appear as contextual buttons, preventing clutter for people who only need to report a fault.

On web, the same navigation becomes a left rail from tablet width upward. Dashboards use a main work area with a secondary summary panel when space permits. Tables do not replace mobile cards; they are only used for administrative work lists on wide screens. Touch targets remain at least 44 px tall, status is communicated in text as well as color, and all important actions are reachable without horizontal scrolling.

## Initial Data Model

| Entity | Important Fields |
|---|---|
| User profile | Name, email, role, team, notification preference |
| Maintenance request | Reference number, title, category, location, description, urgency, status, reporter, assignee, team, timestamps |
| Activity update | Request reference, author, action type, note, timestamp |
| Team | ICT, Physical Maintenance, Security |

## MVP Scope Boundary

The first functional version will use a structured demonstration workspace with role switching and realistic sample requests. The implementation will keep domain models and user interface boundaries ready for production authentication, cross-device data synchronization, image uploads, and notifications. Those services can be connected after the team confirms its operational policies and user onboarding process.
