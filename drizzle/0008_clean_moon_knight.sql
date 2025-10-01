PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gdpr-seeker_admin_users` (
	`userId` text(255) PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_gdpr-seeker_admin_users`("userId", "createdAt") SELECT "userId", "createdAt" FROM `gdpr-seeker_admin_users`;--> statement-breakpoint
DROP TABLE `gdpr-seeker_admin_users`;--> statement-breakpoint
ALTER TABLE `__new_gdpr-seeker_admin_users` RENAME TO `gdpr-seeker_admin_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_gdpr-seeker_gdpr_request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyId` integer NOT NULL,
	`userId` text(255) NOT NULL,
	`position` text(255) NOT NULL,
	`firstName` text(255) NOT NULL,
	`lastName` text(255) NOT NULL,
	`applicantEmail` text(255) NOT NULL,
	`phone` text(255) NOT NULL,
	`dateOfBirth` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`companyId`) REFERENCES `gdpr-seeker_company`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_gdpr-seeker_gdpr_request`("id", "companyId", "userId", "position", "firstName", "lastName", "applicantEmail", "phone", "dateOfBirth", "createdAt", "updatedAt") SELECT "id", "companyId", "userId", "position", "firstName", "lastName", "applicantEmail", "phone", "dateOfBirth", "createdAt", "updatedAt" FROM `gdpr-seeker_gdpr_request`;--> statement-breakpoint
DROP TABLE `gdpr-seeker_gdpr_request`;--> statement-breakpoint
ALTER TABLE `__new_gdpr-seeker_gdpr_request` RENAME TO `gdpr-seeker_gdpr_request`;--> statement-breakpoint
CREATE INDEX `gdpr_request_company_idx` ON `gdpr-seeker_gdpr_request` (`companyId`);--> statement-breakpoint
CREATE INDEX `gdpr_request_user_idx` ON `gdpr-seeker_gdpr_request` (`userId`);