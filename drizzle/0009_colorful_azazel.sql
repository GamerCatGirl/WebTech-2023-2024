CREATE TABLE `liked comments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`comment_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE comment ADD `likes` text;--> statement-breakpoint
ALTER TABLE comment ADD `userID` text NOT NULL;