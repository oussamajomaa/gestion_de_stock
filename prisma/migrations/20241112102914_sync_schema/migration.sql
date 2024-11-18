/*
  Warnings:

  - Made the column `batchId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_batchId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `batchId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
