/*
  Warnings:

  - The `status` column on the `Impound_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ImpoundStatus" AS ENUM ('IMPOUNDED', 'RELEASED', 'PENDING', 'OVERDUE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Impound_records" DROP COLUMN "status",
ADD COLUMN     "status" "ImpoundStatus" NOT NULL DEFAULT 'IMPOUNDED';
