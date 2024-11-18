/*
  Warnings:

  - Made the column `article_quantity` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Article` MODIFY `article_quantity` DOUBLE NOT NULL;
