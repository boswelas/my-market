import ChatMessagesList from "@/components/chat-messages-list";
import CloseButton from "@/components/close-button";
import TabBar from "@/components/tab-bar";
import db from "@/lib/database"
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id,
        },
        include: {
            users: {
                select: { id: true },
            },
            product: {
                select: {
                    id: true,
                    userId: true,
                },
            }
        }
    });
    if (room) {
        const session = await getSession();
        const allowedChat = Boolean(room.users.find(user => user.id === session.id!))
        // const allowedChat = Boolean(room.users.find(user => user.id === 3))
        if (!allowedChat) {
            return null;
        }
    }
    return room;
}

async function getMessages(chatRoomId: string) {
    const messages = await db.message.findMany({
        where: {
            chatRoomId,
        },
        select: {
            id: true,
            payload: true,
            created_at: true,
            userId: true,
            user: {
                select: {
                    avatar: true,
                    username: true,
                },
            }
        }
    });
    return messages;
}

async function getUserProfile() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            // id: 3
            id: session.id
        },
        select: {
            username: true,
            avatar: true,
        }
    });
    return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id)
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(params.id);
    const session = await getSession();
    const user = await getUserProfile();
    if (!user) {
        return notFound();
    }
    return (
        <div className="p-5 flex flex-col h-screen max-w-7xl">
            <div>
                <div>
                    <CloseButton />
                </div>
                <span>Rating Bar</span>
                {/* <div>{room.product.userId == 3 ? ( */}
                <div>{room.product.userId == session.id! ? (
                    <div>
                        <span>Mark as Sold</span>
                        <span>Rate Buyer</span>
                    </div>) : (
                    <div></div>)}
                </div>
            </div>
            <ChatMessagesList
                chatRoomId={params.id}
                // userId={3}
                userId={session.id!}
                username={user.username}
                avatar={user.avatar!}
                initialMessages={initialMessages} />
        </div>
    )


}
