-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_bookId_fkey";

-- AlterTable
ALTER TABLE "Command" ALTER COLUMN "bookId" DROP NOT NULL,
ALTER COLUMN "bookId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
