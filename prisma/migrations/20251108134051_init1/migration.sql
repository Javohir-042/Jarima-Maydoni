-- DropForeignKey
ALTER TABLE "public"."Logs" DROP CONSTRAINT "Logs_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
