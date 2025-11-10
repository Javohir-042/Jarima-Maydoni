/*
  Warnings:

  - You are about to drop the column `otp` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expire` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "otp",
DROP COLUMN "otp_expire";
