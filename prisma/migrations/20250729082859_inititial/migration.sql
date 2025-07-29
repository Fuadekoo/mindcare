-- CreateTable
CREATE TABLE `midcare_user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `midcare_user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wpos_wpdatatable_23` (
    `wdt_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `passcode` VARCHAR(191) NULL,
    `phoneno` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `isKid` BOOLEAN NULL DEFAULT false,
    `ustaz` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `package` VARCHAR(191) NULL,
    `youtubeSubject` VARCHAR(191) NULL,
    `chat_id` VARCHAR(191) NULL DEFAULT '',
    `u_control` VARCHAR(255) NULL,

    UNIQUE INDEX `wpos_wpdatatable_23_passcode_key`(`passcode`),
    UNIQUE INDEX `wpos_wpdatatable_23_phoneno_key`(`phoneno`),
    PRIMARY KEY (`wdt_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `caseId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `historyCode` VARCHAR(191) NOT NULL,
    `patientTypeData` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `solved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `history_historyCode_key`(`historyCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `progressTracking` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `progress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todoList` (
    `id` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `history`(`historyCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_patientTypeData_fkey` FOREIGN KEY (`patientTypeData`) REFERENCES `patientType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diagnosis` ADD CONSTRAINT `diagnosis_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `observation` ADD CONSTRAINT `observation_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treatment` ADD CONSTRAINT `treatment_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progressTracking` ADD CONSTRAINT `progressTracking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `wpos_wpdatatable_23`(`wdt_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
