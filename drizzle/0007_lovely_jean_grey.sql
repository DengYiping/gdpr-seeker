DROP INDEX "account_user_id_idx";--> statement-breakpoint
DROP INDEX "company_name_idx";--> statement-breakpoint
DROP INDEX "company_domain_unique";--> statement-breakpoint
DROP INDEX "gdpr_request_interview_request_idx";--> statement-breakpoint
DROP INDEX "gdpr_request_state_request_idx";--> statement-breakpoint
DROP INDEX "gdpr_request_company_idx";--> statement-breakpoint
DROP INDEX "gdpr_request_user_idx";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
ALTER TABLE `gdpr-seeker_gdpr_request` ALTER COLUMN "firstName" TO "firstName" text(255) NOT NULL;--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `gdpr-seeker_account` (`userId`);--> statement-breakpoint
CREATE INDEX `company_name_idx` ON `gdpr-seeker_company` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `company_domain_unique` ON `gdpr-seeker_company` (`domain`);--> statement-breakpoint
CREATE INDEX `gdpr_request_interview_request_idx` ON `gdpr-seeker_gdpr_request_interview` (`requestId`);--> statement-breakpoint
CREATE INDEX `gdpr_request_state_request_idx` ON `gdpr-seeker_gdpr_request_state` (`requestId`);--> statement-breakpoint
CREATE INDEX `gdpr_request_company_idx` ON `gdpr-seeker_gdpr_request` (`companyId`);--> statement-breakpoint
CREATE INDEX `gdpr_request_user_idx` ON `gdpr-seeker_gdpr_request` (`userId`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `gdpr-seeker_session` (`userId`);--> statement-breakpoint
ALTER TABLE `gdpr-seeker_gdpr_request` ALTER COLUMN "lastName" TO "lastName" text(255) NOT NULL;