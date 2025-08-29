-- AlterTable
ALTER TABLE `assessment` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `diagnosis` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `observation` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `treatment` MODIFY `description` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `StudentGeneralCase` ADD CONSTRAINT `StudentGeneralCase_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
