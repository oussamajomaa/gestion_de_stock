/*
  Warnings:

  - You are about to drop the column `article_quantity` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_date` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_articleId_fkey`;

-- AlterTable
ALTER TABLE `Article` DROP COLUMN `article_quantity`,
    DROP COLUMN `expiration_date`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `articleId`,
    ADD COLUMN `batchId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Batch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER NOT NULL,
    `expiration_date` DATETIME(3) NOT NULL,
    `quantity` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
