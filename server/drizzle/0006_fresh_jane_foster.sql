CREATE TABLE "auth_code_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"app_client_id" uuid NOT NULL,
	"id_token" varchar(2048) NOT NULL,
	"access_token" varchar(2048) NOT NULL,
	"refresh_token" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	CONSTRAINT "auth_code_table_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "auth_code_table" ADD CONSTRAINT "auth_code_table_app_client_id_app_table_app_client_id_fk" FOREIGN KEY ("app_client_id") REFERENCES "public"."app_table"("app_client_id") ON DELETE no action ON UPDATE no action;