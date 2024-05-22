"use client";

import { checkExistingChat, createChatRoom } from "@/app/posts/[id]/actions";
import db from "@/lib/database";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from 'react';




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
