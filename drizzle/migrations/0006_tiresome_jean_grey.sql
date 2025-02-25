PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`application_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `user_applications`;--> statement-breakpoint
ALTER TABLE `__new_user_applications` RENAME TO `user_applications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;