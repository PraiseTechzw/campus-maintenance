CREATE TABLE `maintenance_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(32) NOT NULL,
	`reporterId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('ICT','Plumbing','Electrical','Building','Cleaning','Security') NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`priority` enum('Low','Medium','High','Urgent') NOT NULL,
	`status` enum('Submitted','Assigned','In Progress','Resolved') NOT NULL DEFAULT 'Submitted',
	`team` enum('ICT','Physical Maintenance','Security') NOT NULL,
	`assigneeName` varchar(160),
	`attachmentKey` varchar(512),
	`attachmentUrl` text,
	`acknowledged` boolean NOT NULL DEFAULT false,
	`satisfaction` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `maintenance_requests_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `maintenance_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`authorId` int NOT NULL,
	`action` varchar(160) NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `maintenance_updates_id` PRIMARY KEY(`id`)
);
