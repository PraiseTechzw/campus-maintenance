# Identity, Preferences, and Campus Map Data Specification

## Institution Identity Routing

The authenticated account is the source of identity. A Campus Maintenance profile is linked to the existing authenticated user record and stores one operational role: **Student**, **ICT Technician**, **Physical-Maintenance Technician**, **Security Officer**, or **Administrator**. On first sign-in, accounts default to Student unless an authorized administrator has assigned a different role. After authentication, the saved operational role sets the application workspace automatically.

## Account Preferences

Each authenticated profile receives one notification-preference record with toggles for assignments, technician arrivals, urgent alerts, and resolutions. The notification screen reads and updates this account-owned record through protected application APIs. The current local switches remain usable in demonstration mode, while signed-in use persists them.

## Campus Building Coordinates

The application will use a `campus_buildings` data model containing building code, name, latitude, longitude, access note, and operational area. This lets a request location resolve to a building record and gives the location sheet a coordinate-backed context.

> **Verified geography requirement:** the exact campus has not been identified in this project. The coordinate model and API will be implemented now, but real building records require the institution name plus an official campus map, GIS export, or approved building-coordinate list before they can be loaded.
