"use client"
import { ArrowUpCircleIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";


interface SubmitCommentProps {
    isLiked: boolean,
    likeCount: number;
    postId: number,
}

export default function SubmitComment() {

    return (
        <div className="w-full">
            <form className="flex relative" >
                <input required
                    className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition
    ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                    type="text"
                    name="message"
                    placeholder="Write message..."
                />
                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div>
        // <button
        //     onClick={onClick}
        //     className={`flex items-center gap-2  text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${state.isLiked
        //         ? "bg-orange-500 text-white border-orange-500"
        //         : "hover:bg-neutral-800"
        //         }`}
        // >
        //     {state.isLiked ? (
        //         <HandThumbUpIcon className="size-5" />
        //     ) : (
        //         <OutlineHandThumbUpIcon className="size-5" />
        //     )}
        //     <span>Like ({likeCount})</span>
        // </button>
    )
}
