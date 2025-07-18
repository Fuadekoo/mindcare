/*
  Warnings:

  - You are about to drop the column `diagnosis` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `history` DROP COLUMN `diagnosis`,
    DROP COLUMN `observation`,
    DROP COLUMN `treatment`;

-- CreateTable
CREATE TABLE `diagnosis` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `historyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `observation` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `historyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treatment` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `historyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diagnosis` ADD CONSTRAINT `diagnosis_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `observation` ADD CONSTRAINT `observation_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treatment` ADD CONSTRAINT `treatment_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
