CREATE TABLE `campus_sla_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`priority` varchar(16) NOT NULL,
	`targetHours` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_sla_policies_id` PRIMARY KEY(`id`),
	CONSTRAINT `campus_sla_policies_priority_unique` UNIQUE(`priority`)
);
