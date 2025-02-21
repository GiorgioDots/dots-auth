PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client_id` text NOT NULL,
	`client_secret` text NOT NULL,
	`redirect_uri` text,
	`token_expiration_seconds` integer NOT NULL,
	`refresh_token_expiration_seconds` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_applications`("id", "name", "client_id", "client_secret", "redirect_uri", "token_expiration_seconds", "refresh_token_expiration_seconds") SELECT "id", "name", "client_id", "client_secret", "redirect_uri", "token_expiration_seconds", "refresh_token_expiration_seconds" FROM `applications`;--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
ALTER TABLE `__new_applications` RENAME TO `applications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `applications_client_id_unique` ON `applications` (`client_id`);