/*
  Warnings:

  - Added the required column `gender` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "state" TEXT NOT NULL;
