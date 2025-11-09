/*
  Warnings:

  - The `status` column on the `Fines` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FinesStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'OVERDUE');

-- AlterTable
ALTER TABLE "Fines" DROP COLUMN "status",
ADD COLUMN     "status" "FinesStatus" NOT NULL DEFAULT 'PENDING';
