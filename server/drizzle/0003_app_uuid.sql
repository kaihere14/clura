DROP TABLE IF EXISTS "app_table" CASCADE;
--> statement-breakpoint
CREATE TABLE "app_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"app_client_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"app_secret" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_table_app_client_id_unique" UNIQUE("app_client_id"),
	CONSTRAINT "app_table_app_secret_unique" UNIQUE("app_secret"),
	CONSTRAINT "app_table_client_id_client_table_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client_table"("id") ON DELETE no action ON UPDATE no action
);
