/*
  Warnings:

  - A unique constraint covering the columns `[studentId,priority]` on the table `history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `priority` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` ADD COLUMN `priority` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `history_studentId_priority_key` ON `history`(`studentId`, `priority`);
