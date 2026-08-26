CREATE TABLE `campus_buildings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(160) NOT NULL,
	`area` varchar(160),
	`latitude` varchar(32) NOT NULL,
	`longitude` varchar(32) NOT NULL,
	`accessNote` text,
	`active` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_buildings_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_buildings_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `campus_user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`operationalRole` varchar(32) NOT NULL DEFAULT 'student',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_user_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`assignments` boolean NOT NULL DEFAULT true,
	`arrivals` boolean NOT NULL DEFAULT true,
	`urgent` boolean NOT NULL DEFAULT true,
	`resolutions` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `maintenance_requests` ADD `arrivalTime` varchar(80);