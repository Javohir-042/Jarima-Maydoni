-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "otp" VARCHAR(6),
ADD COLUMN     "otp_expire" TIMESTAMP(3);
