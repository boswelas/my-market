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

export async function existingRating(raterId: number, rateeId: number, productId: number,) {
    try {
        const existRating = await db.rating.findUnique({
            where: {
                id: {
                    raterId,
                    rateeId,
                    productId
                }
            },
            select: {
                rating: true,
            }
        });
        return existRating;
    }
    catch (error) {
        console.error('Error finding existing rating:', error);
        throw error;
    }
}

export async function giveRating(raterId: number, rateeId: number, productId: number, rating: number) {
    try {
        const giveRating = await db.rating.upsert({
            where: {
                id: {
                    raterId,
                    rateeId,
                    productId
                }
            },
            update: {
                rating: rating,
            },
            create: {
                rater: {
                    connect: {
                        id: raterId,
                    }
                },
                ratee: {
                    connect: {
                        id: rateeId,
                    }
                },
                product: {
                    connect: {
                        id: productId,
                    }
                },
                rating: rating,
            }
        });
    }
    catch (error) {
        console.error('Error giving rating:', error);
        throw error;
    }
}
