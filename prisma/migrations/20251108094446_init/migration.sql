/*
  Warnings:

  - The `rate_type` column on the `storage_rates` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('DAILY', 'HOURLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "storage_rates" DROP COLUMN "rate_type",
ADD COLUMN     "rate_type" "RateType" NOT NULL DEFAULT 'DAILY';
