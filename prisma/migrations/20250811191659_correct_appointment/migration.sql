-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `appointment_caseId_fkey`;

-- DropIndex
DROP INDEX `appointment_caseId_fkey` ON `appointment`;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `history`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
