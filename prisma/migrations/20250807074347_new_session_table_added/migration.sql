/*
  Warnings:

  - You are about to drop the column `studentId` on the `appointment` table. All the data in the column will be lost.
  - Added the required column `studentGeneralCaseId` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `appointment_studentId_fkey`;

-- DropIndex
DROP INDEX `appointment_studentId_fkey` ON `appointment`;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `studentId`;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `studentGeneralCaseId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `wpos_wpdatatable_23` ADD COLUMN `studentGeneralCaseId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `StudentGeneralCase` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentGeneralCase_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentGeneralCase` ADD CONSTRAINT `StudentGeneralCase_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_studentGeneralCaseId_fkey` FOREIGN KEY (`studentGeneralCaseId`) REFERENCES `StudentGeneralCase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
