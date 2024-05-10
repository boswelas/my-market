import db from "@/lib/database"
import { notFound } from "next/navigation";

async function getRoom(id: string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id,
        },
        include: {
            users: {
                select: { id: true },
            }
        }
    });
    console.log(room);
    if (!room) {
        return notFound();
    }
    return room;
}

export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id)
    return <h1>Chat</h1>
}
