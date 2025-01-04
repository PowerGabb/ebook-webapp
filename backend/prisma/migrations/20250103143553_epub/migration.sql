/*
  Warnings:

  - You are about to drop the `PageBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageBook" DROP CONSTRAINT "PageBook_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "fileBook" TEXT;

-- DropTable
DROP TABLE "PageBook";
