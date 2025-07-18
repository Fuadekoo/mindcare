/*
  Warnings:

  - The primary key for the `appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `progresstracking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `todolist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[historyCode]` on the table `history` will be added. If there are existing duplicate values, this will fail.
  - The required column `historyCode` was added to the `history` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `patientTypeData` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `history` DROP PRIMARY KEY,
    ADD COLUMN `historyCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `patientTypeData` VARCHAR(191) NOT NULL,
    ADD COLUMN `solved` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `progresstracking` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `todolist` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `patientType` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `patientType_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `history_historyCode_key` ON `history`(`historyCode`);

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_patientTypeData_fkey` FOREIGN KEY (`patientTypeData`) REFERENCES `patientType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
