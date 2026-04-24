ALTER TABLE "client_table" ALTER COLUMN "google_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "client_table" ADD COLUMN "github_id" varchar(255) UNIQUE;
--> statement-breakpoint
ALTER TABLE "user_table" ALTER COLUMN "google_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "user_table" ADD COLUMN "github_id" varchar(255) UNIQUE;
