-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "productId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
