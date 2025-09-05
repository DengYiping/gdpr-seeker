CREATE TABLE `gdpr-seeker_company` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`domain` text(255) NOT NULL,
	`gdprEmail` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `company_name_idx` ON `gdpr-seeker_company` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `company_domain_unique` ON `gdpr-seeker_company` (`domain`);
