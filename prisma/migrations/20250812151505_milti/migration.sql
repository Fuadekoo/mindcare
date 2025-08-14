-- AddForeignKey
ALTER TABLE `StudentGeneralCase` ADD CONSTRAINT `StudentGeneralCase_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
