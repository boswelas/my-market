import ChatMessagesList from "@/components/chat-messages-list";
import CloseButton from "@/components/close-button";
import db from "@/lib/database"
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { existingRating, markAsSold, unmarkAsSold } from "./actions";
import UserRating from "@/components/user-rating";

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
                    sold: true,
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
    const buyer = room.users.find(user => user.id !== room.product.userId)!.id;
    const seller = room.product.userId;
    const initialMessages = await getMessages(params.id);
    const session = await getSession();
    const rater = session.id!;
    // const rater = 3;
    let ratee: number;
    if (rater === seller) {
        ratee = buyer;
    } else {
        ratee = seller;
    }
    const user = await getUserProfile();
    if (!user) {
        return notFound();
    }

    async function markSold() {
        "use server"
        if (buyer) {
            await markAsSold(room!.productId, buyer, room!.id);
        }
    }

    async function unmarkSold() {
        "use server"
        if (buyer) {
            await unmarkAsSold(room!.productId, buyer, room!.id);
        }
    }

    const getExistingRating = async (rater: number, ratee: number, productId: number) => {
        console.log("getting rating!")
        const oldRating = await existingRating(rater, ratee, productId);
        console.log(oldRating);
        return oldRating ? oldRating.rating : 0;
    };

    const oldRating = await getExistingRating(rater, ratee, room.product.id);

    return (
        <div className="p-5 flex flex-col h-screen">
            <div>
                <div>
                    <CloseButton />
                </div>
                {/* <div>{room.product.userId == 3 ? ( */}
                <div>{room.product.userId == session.id! ? (
                    <div>
                        {room.product.sold === false ? (
                            <div>
                                <form action={markSold}>
                                    <button type="submit">Mark As Sold</button>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <div>
                                    <form action={unmarkSold}>
                                        <button type="submit">Undo Sale</button>
                                    </form>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">Rate Buyer:</span>
                                    <UserRating rater={rater} ratee={ratee} productId={room.product.id} existingRating={oldRating} chatPath={params.id} />
                                </div>
                            </div>

                        )}

                    </div>
                ) : (
                    <div>
                        {
                            room.product.sold === true ? (
                                <div className="flex items-center">
                                    <span className="mr-2">Rate Seller:</span>
                                    <UserRating rater={rater} ratee={ratee} productId={room.product.id} existingRating={oldRating} chatPath={params.id} />
                                </div>
                            ) : (
                                <div />)
                        }</div>)}
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


