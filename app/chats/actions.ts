"use server"

import db from "@/lib/database";
import getSession from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
    const session = await getSession();
    const message = await db.message.create({
        data: {
            payload,
            chatRoomId,
            userId: session.id!,
        },
        select: { id: true },
    })
    const updateChat = await db.chatRoom.update({
        where: {
            id: chatRoomId,
        },
        data: {
            updated_at: new Date(),
        }
    })
};
