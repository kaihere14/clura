ALTER TABLE "user_table" ALTER COLUMN "google_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_table" ADD COLUMN "github_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user_table" ADD CONSTRAINT "user_table_github_id_unique" UNIQUE("github_id");