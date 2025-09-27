-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('HR', 'Employee') NOT NULL DEFAULT 'Employee';
