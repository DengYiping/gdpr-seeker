CREATE TABLE `gdpr-seeker_admin_users` (
	`userId` text(255) PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `gdpr-seeker_user`(`id`) ON UPDATE no action ON DELETE no action
);
