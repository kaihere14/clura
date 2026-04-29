ALTER TABLE "client_table" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "user_table" ADD COLUMN "password_hash" text;