CREATE TABLE `campus_escalation_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`priority` varchar(16) NOT NULL,
	`thresholdMinutes` int NOT NULL,
	`notifyRole` varchar(32) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_escalation_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_escalation_rules_priority_unique` UNIQUE(`priority`)
);
--> statement-breakpoint
CREATE TABLE `campus_staff_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`manageUsers` boolean NOT NULL DEFAULT false,
	`manageRequests` boolean NOT NULL DEFAULT false,
	`manageLocations` boolean NOT NULL DEFAULT false,
	`manageServiceLevels` boolean NOT NULL DEFAULT false,
	`manageEscalations` boolean NOT NULL DEFAULT false,
	`viewAnalytics` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_staff_permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_staff_permissions_userId_unique` UNIQUE(`userId`)
);
