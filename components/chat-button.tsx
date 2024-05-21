import db from "@/lib/database";
import getSession from "@/lib/session";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";




export default function ChatButton({ userId, postUser }: { userId: number, postUser: number }) {
    const checkExistingChat = async () => {
        "use server";
        const session = await getSession();
        const isChat = await db.chatRoom.findFirst({
            where: {
                AND: [
                    {
                        users: {
                            some: {
                                id: session.id,
                            },
                        },
                    },
                    {
                        users: {
                            some: {
                                id: postUser,
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
            },
        });
        if (isChat) {
            redirect(`../chats/${isChat.id}`)
        } else {
            createChatRoom();
        }
    }

    const createChatRoom = async () => {
        "use server";
        const session = await getSession();
        const room = await db.chatRoom.create({
            data: {
                users: {
                    connect: [{
                        id: postUser
                    }, {

                        id: session.id
                    },],
                },
            },
            select: {
                id: true,
            },
        });
        redirect(`../chats/${room.id}`)
    }

    const onClick = async () => {
        console.log("button clicked");
    }

    return (
        <div>
            <button onClick={checkExistingChat} className="font-white">
                < ChatBubbleBottomCenterIcon className="size-4" />
            </button>
        </div>
    )
}
