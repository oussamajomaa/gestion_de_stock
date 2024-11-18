/*
  Warnings:

  - You are about to drop the column `expiration_date` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToRecette` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_ArticleToRecette` DROP FOREIGN KEY `_ArticleToRecette_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ArticleToRecette` DROP FOREIGN KEY `_ArticleToRecette_B_fkey`;

-- AlterTable
ALTER TABLE `Article` DROP COLUMN `expiration_date`;

-- DropTable
DROP TABLE `_ArticleToRecette`;

-- CreateTable
CREATE TABLE `RecetteArticle` (
    `recetteId` INTEGER NOT NULL,
    `articleId` INTEGER NOT NULL,

    PRIMARY KEY (`recetteId`, `articleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Article_barcode_key` ON `Article`(`barcode`);

-- CreateIndex
CREATE INDEX `Article_article_name_idx` ON `Article`(`article_name`);

-- CreateIndex
CREATE INDEX `Batch_expiration_date_idx` ON `Batch`(`expiration_date`);

-- CreateIndex
CREATE INDEX `Transaction_transaction_date_idx` ON `Transaction`(`transaction_date`);

-- AddForeignKey
ALTER TABLE `RecetteArticle` ADD CONSTRAINT `RecetteArticle_recetteId_fkey` FOREIGN KEY (`recetteId`) REFERENCES `Recette`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecetteArticle` ADD CONSTRAINT `RecetteArticle_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Batch` RENAME INDEX `Batch_articleId_fkey` TO `Batch_articleId_idx`;
