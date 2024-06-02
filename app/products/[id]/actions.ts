"use server";

import db from "@/lib/database";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";


export default async function deleteProduct(productId: number) {
    const session = await getSession();
    const user = await session.id;
    if (!user) {
        return notFound();
    }
    const owner = await db.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            userId: true,
        }
    });
    if (user === owner!.userId) {
        const deleteProd = await db.product.update({
            where: {
                id: productId,
            }, data: {
                visible: false
            }
        });
        revalidatePath(`../home`)
        redirect(`../profile`)
    } else {
        return notFound();
    }
}
export async function checkExistingChat(userId: number, owner: number, productId: number) {
    try {
        const isChat = await db.chatRoom.findFirst({
            where: {
                AND: [
                    { users: { some: { id: userId } } },
                    { users: { some: { id: owner } } },
                    { productId: productId }
                ],
            },
            select: { id: true },
        });
        return isChat ? isChat.id : null;
    } catch (error) {
        console.error('Error checking existing chat:', error);
        throw error;
    }
};

export async function createChatRoom(userId: number, owner: number, productId: number) {
    try {
        const room = await db.chatRoom.create({
            data: {
                product: {
                    connect: {
                        id: productId,
                    },
                },
                users: {
                    connect: [{ id: userId }, { id: owner }],
                },
                updated_at: new Date(),
            },
            select: { id: true },
        });

        return room.id;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};
