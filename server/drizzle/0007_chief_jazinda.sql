ALTER TABLE "client_table" ALTER COLUMN "google_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "client_table" ADD COLUMN "github_id" varchar(255);--> statement-breakpoint
ALTER TABLE "client_table" ADD CONSTRAINT "client_table_github_id_unique" UNIQUE("github_id");