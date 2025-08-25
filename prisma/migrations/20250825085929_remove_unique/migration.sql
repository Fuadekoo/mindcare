-- DropForeignKey
ALTER TABLE `studentgeneralcase` DROP FOREIGN KEY `StudentGeneralCase_studentId_fkey`;

-- DropIndex
DROP INDEX `uniq_student_open_case` ON `studentgeneralcase`;

-- CreateTable
CREATE TABLE `assessment` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `historyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assessment` ADD CONSTRAINT `assessment_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE `assessment` ADD CONSTRAINT `assessment_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
