/*
  Warnings:

  - Made the column `expiration_date` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `expiration_date` DATETIME(3) NOT NULL;
