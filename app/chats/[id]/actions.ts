"use server"
import db from "@/lib/database";



export default async function markAsSold(productId: number, buyerId: number) {
    try {
        const updateSold = await db.product.update({
            where: {
                id: productId
            },
            data: {
                sold: true,
                visible: false,
            }
        });
        if (updateSold) {
            const updatePurchase = await db.purchase.create({
                data: {
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                    buyer: {
                        connect: {
                            id: buyerId,
                        }
                    },
                }
            });
        }

    } catch (error) {
        console.error('Error checking existing chat:', error);
        throw error;
    }
}
