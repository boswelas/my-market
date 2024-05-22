"use client";

import db from "@/lib/database";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/router';
import { useState } from 'react';

async function checkExistingChat(userId: number, postUser: number) {
    try {
        const isChat = await db.chatRoom.findFirst({
            where: {
                AND: [
                    { users: { some: { id: userId } } },
                    { users: { some: { id: postUser } } }
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

async function createChatRoom(userId: number, postUser: number) {
    try {
        const room = await db.chatRoom.create({
            data: {
                users: {
                    connect: [{ id: userId }, { id: postUser }],
                },
            },
            select: { id: true },
        });

        return room.id;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};

export default function ChatButton({ userId, postUser }: { userId: number, postUser: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        try {
            let chatId = await checkExistingChat(userId, postUser);
            if (!chatId) {
                chatId = await createChatRoom(userId, postUser);
            }
            router.push(`../chats/${chatId}`);
        } catch (error) {
            console.error('Error on button click:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onClick} className="font-white" disabled={loading}>
                <ChatBubbleBottomCenterIcon className="size-4" />
            </button>
        </div>
    );
}
