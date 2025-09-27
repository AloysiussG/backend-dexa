-- AlterTable
ALTER TABLE `attendances` MODIFY `status` ENUM('Present', 'Late', 'Absent') NULL;
