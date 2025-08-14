/*
  Warnings:

  - You are about to drop the column `studentGeneralCaseId` on the `wpos_wpdatatable_23` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,openFlag]` on the table `StudentGeneralCase` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `studentgeneralcase` DROP FOREIGN KEY `StudentGeneralCase_studentId_fkey`;

-- DropIndex
DROP INDEX `StudentGeneralCase_studentId_key` ON `studentgeneralcase`;

-- AlterTable
ALTER TABLE `studentgeneralcase` ADD COLUMN `openFlag` INTEGER NULL;

-- AlterTable
ALTER TABLE `wpos_wpdatatable_23` DROP COLUMN `studentGeneralCaseId`;

-- CreateIndex
CREATE UNIQUE INDEX `uniq_student_open_case` ON `StudentGeneralCase`(`studentId`, `openFlag`);

-- AddForeignKey
-- ALTER TABLE `treatment` ADD CONSTRAINT `treatment_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
