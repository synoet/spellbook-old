/*
  Warnings:

  - You are about to drop the column `bookId` on the `Command` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_bookId_fkey";

-- AlterTable
ALTER TABLE "Command" DROP COLUMN "bookId";
