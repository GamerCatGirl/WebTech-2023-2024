CREATE TABLE `comment` (
	`id` text PRIMARY KEY NOT NULL,
	`comment` text NOT NULL,
	`answered on` text,
	`recipe_id` text NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE recipe ADD `time` integer;--> statement-breakpoint
ALTER TABLE recipe ADD `type` text;--> statement-breakpoint
ALTER TABLE recipe ADD `difficulty` text;--> statement-breakpoint
ALTER TABLE recipe ADD `score` real;