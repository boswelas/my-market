/*
  Warnings:

  - You are about to drop the column `productId` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_productId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "productId";
