import db from "@/lib/database";
import getSession from "@/lib/session";
import { GetChatTime } from "@/lib/utils";
import { redirect } from 'next/navigation'
import Link from "next/link";
import { NextResponse } from "next/server";
import { number } from "zod";

export const metadata = {
    title: "Chats"
}

async function getChats(user?: number) {

    const chats = await db.user.findMany({
        where: {
            id: user,
        },
        include: {
            chatrooms: {
                orderBy: {
                    updated_at: 'desc'
                }, where: {
                    messages: {
                        some: {}
                    }
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

export default async function Chat() {
    const session = await getSession();
    const user = session.id;
    // const user = 3;

    const chats = await getChats(user);
    if (typeof user !== "number") {
        redirect(`/home-login`)
    }
    if (!chats || chats.length === 0) {
        return <div>No Chats to Display</div>
    } else {
        return (
            <>
                <div className="flex flex-col items-center">
                    <div className="w-[20em] sm:w-[30em] md:w-[40em] lg:w-[50em]">
                        <div>
                            <h1 className="text-white text-4xl">Chats</h1>
                        </div>
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
                                            <span>{GetChatTime(chatroom.updated_at)}</span>
                                        </div>
                                        <div className="pb-5 mb-5">
                                            <span className="ml-11">{chatroom.messages.map(message => message.payload)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className=" mt-14" />
                    </div>
                </div>
            </>
        )
    };
}
