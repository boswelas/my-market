"use client"
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";

//get info of currentuser
//get info about post user
// check for existing chat --- redirect to chat
// make new chat


export default function ChatButton({ userId, postUser }: { userId: number, postUser: number }) {
    const onClick = async () => {
        console.log("button clicked");
    }
    return (
        <div>
            <button onClick={onClick} className="font-white">
                < ChatBubbleBottomCenterIcon className="size-4" />
            </button>
        </div>
    )
}
