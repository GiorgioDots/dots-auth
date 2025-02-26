PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_refresh_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`is_invalidated` integer DEFAULT false NOT NULL,
	`application_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `refresh_tokens`;--> statement-breakpoint
ALTER TABLE `__new_refresh_tokens` RENAME TO `refresh_tokens`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_refresh_token_unique` ON `refresh_tokens` (`refresh_token`);