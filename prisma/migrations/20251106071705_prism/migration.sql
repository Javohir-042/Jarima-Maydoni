/*
  Warnings:

  - Made the column `phone_number` on table `SuperAdmin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SuperAdmin" ADD COLUMN     "hashedRefreshToken" TEXT,
ALTER COLUMN "phone_number" SET NOT NULL;
