CREATE TABLE `campus_admin_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`subjectUserId` int,
	`eventType` varchar(80) NOT NULL,
	`description` varchar(500) NOT NULL,
	`beforeData` text,
	`afterData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campus_admin_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campus_staff_provisionings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`displayName` varchar(160),
	`operationalRole` varchar(32) NOT NULL,
	`manageUsers` boolean NOT NULL DEFAULT false,
	`manageRequests` boolean NOT NULL DEFAULT false,
	`manageLocations` boolean NOT NULL DEFAULT false,
	`manageServiceLevels` boolean NOT NULL DEFAULT false,
	`manageEscalations` boolean NOT NULL DEFAULT false,
	`viewAnalytics` boolean NOT NULL DEFAULT false,
	`importedByUserId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_staff_provisionings_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_staff_provisionings_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `maintenance_requests` ADD `resolvedAt` timestamp;