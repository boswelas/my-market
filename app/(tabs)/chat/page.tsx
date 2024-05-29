import db from "@/lib/database";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
    title: "Chats"
}

async function getChats() {
    const session = await getSession();
    const user = session.id;
    const chats = await db.user.findMany({
        where: {
            id: user,
        },
        include: {
            chatrooms: {
                orderBy: {
                    updated_at: 'desc'
                },
                include: {
                    users: {
                        where: {
                            id: {
                                not: user
                            }
                        },
                        select: {
                            username: true,
                            avatar: true
                        }
                    },
                    messages: {
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: 1,
                        select: {
                            payload: true,
                            updated_at: true,
                        }
                    }
                }
            }
        }
    });
    return chats;
}

function isLessThanOneDay(timestamp: Date) {
    const messageTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
    return (currentTime - messageTime) < oneDayInMilliseconds;
}

function formatToTime(timestamp: string) {
    const time = new Date(timestamp);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


export default async function Chat() {
    const chats = await getChats();
    if (!chats || chats.length === 0) {
        return <div>No Chats to Display</div>
    } else {
        return (
            <><div><h1 className="text-white text-4xl">Chats</h1></div>
                <div className="mt-5 p-5 flex flex-col">
                    {chats.flatMap(chat => chat.chatrooms).map(chatroom => (
                        <Link
                            key={chatroom.id}
                            href={`/chats/${chatroom.id}`}
                            className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
                        >
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center">
                                        <img src={chatroom.users[0].avatar!} alt={chatroom.users[0].username} className="w-8 h-8 rounded-full" />
                                        <span className="ml-3 text-xl text-white">{chatroom.users[0].username}</span>
                                    </div>
                                    <span>{isLessThanOneDay(chatroom.updated_at) ? formatToTime(chatroom.updated_at.toString()) : formatToTimeAgo(chatroom.updated_at.toString())}</span>
                                </div>
                                <div className="pb-5 mb-5">
                                    <span className="ml-11">{chatroom.messages.map(message => message.payload)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        )
    };
}
