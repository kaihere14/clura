CREATE TABLE "sso_session_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "sso_session_table_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "sso_session_table" ADD CONSTRAINT "sso_session_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;