CREATE TABLE `follower` (
	`id` text PRIMARY KEY NOT NULL,
	`id follower` text NOT NULL,
	`id following` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usersWithCredentials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`country` text
);
