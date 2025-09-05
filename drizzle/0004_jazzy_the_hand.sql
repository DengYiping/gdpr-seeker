CREATE TABLE `gdpr-seeker_gdpr_request_interview` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requestId` integer NOT NULL,
	`type` text(255) NOT NULL,
	`time` text(255) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `gdpr-seeker_gdpr_request`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `gdpr_request_interview_request_idx` ON `gdpr-seeker_gdpr_request_interview` (`requestId`);--> statement-breakpoint
CREATE TABLE `gdpr-seeker_gdpr_request_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requestId` integer NOT NULL,
	`state` text(64) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`requestId`) REFERENCES `gdpr-seeker_gdpr_request`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `gdpr_request_state_request_idx` ON `gdpr-seeker_gdpr_request_state` (`requestId`);--> statement-breakpoint
CREATE TABLE `gdpr-seeker_gdpr_request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyId` integer NOT NULL,
	`userId` text(255) NOT NULL,
	`position` text(255) NOT NULL,
	`applicantEmail` text(255) NOT NULL,
	`phone` text(255) NOT NULL,
	`dateOfBirth` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`companyId`) REFERENCES `gdpr-seeker_company`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `gdpr-seeker_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `gdpr_request_company_idx` ON `gdpr-seeker_gdpr_request` (`companyId`);--> statement-breakpoint
CREATE INDEX `gdpr_request_user_idx` ON `gdpr-seeker_gdpr_request` (`userId`);