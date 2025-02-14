/*
  Warnings:

  - You are about to drop the column `detail_id` on the `effort_today` table. All the data in the column will be lost.
  - Added the required column `effort_today_id` to the `gear_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `effort_today` DROP FOREIGN KEY `effort_today_ibfk_1`;

-- AlterTable
ALTER TABLE `effort_today` DROP COLUMN `detail_id`;

-- AlterTable
ALTER TABLE `gear_details` ADD COLUMN `effort_today_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `effort_today_ibfk_1_idx` ON `gear_details`(`effort_today_id`);

-- AddForeignKey
ALTER TABLE `gear_details` ADD CONSTRAINT `effort_today_ibfk_1` FOREIGN KEY (`effort_today_id`) REFERENCES `effort_today`(`effort_today_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
