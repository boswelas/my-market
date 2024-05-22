"use client"
import db from "@/lib/database";
import getSession from "@/lib/session";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";

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

        if (isChat) {
            redirect(`../chats/${isChat.id}`);
        } else {
            await createChatRoom(userId, postUser);
        }
    } catch (error) {
        console.error('Error checking existing chat:', error);
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

        redirect(`../chats/${room.id}`);
    } catch (error) {
        console.error('Error creating chat room:', error);
    }
};


export default function ChatButton({ userId, postUser }: { userId: number, postUser: number }) {


    const onClick = async () => {
        try {
            await checkExistingChat(userId, postUser);
        } catch (error) {
            console.error('Error on button click:', error);
        }
    };

    return (
        <div>
            <button onClick={onClick} className="font-white">
                < ChatBubbleBottomCenterIcon className="size-4" />
            </button>
        </div>
    )
}
