CREATE TABLE `practice_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`subject` text NOT NULL,
	`chapter` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`focus_area` text NOT NULL,
	`created_at` integer NOT NULL
);
