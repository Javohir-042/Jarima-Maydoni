/*
  Warnings:

  - The `status` column on the `Tow_trucks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TowTruckStatus" AS ENUM ('AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Tow_trucks" DROP COLUMN "status",
ADD COLUMN     "status" "TowTruckStatus" NOT NULL DEFAULT 'AVAILABLE';
