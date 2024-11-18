-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_batchId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `batchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
