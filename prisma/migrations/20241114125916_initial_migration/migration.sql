/*
  Warnings:

  - You are about to drop the column `article_quantity` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `category_description` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `article_quantity`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `category_description`;
