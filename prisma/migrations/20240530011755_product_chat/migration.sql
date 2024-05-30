-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "productId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
