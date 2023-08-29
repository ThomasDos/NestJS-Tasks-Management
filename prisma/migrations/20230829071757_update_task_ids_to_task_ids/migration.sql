/*
  Warnings:

  - You are about to drop the column `taskIds` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "taskIds",
ADD COLUMN     "task_ids" TEXT[];
