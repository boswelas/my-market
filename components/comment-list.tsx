"use client"

import { InitialComments } from "@/app/posts/[id]/page";
import Image from "next/image";


interface CommentListProps {
    initialComments: InitialComments;
}

export default function CommentList({ initialComments }: CommentListProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {initialComments.map((comment, index) => (
                <div key={index} className="flex items-center gap-3 mt-5">
                    <div >
                        <div className="flex items-center gap-3"> <Image
                            width={28}
                            height={28}
                            className="size-7 rounded-full"
                            src={comment.user.avatar!}
                            alt={comment.user.username}
                        />
                            <span className="text-xs font-bold ">{comment.user.username}</span>
                            <span>·</span>
                            <span className="text-xs text-neutral-400">{comment.updated_at.toDateString()}</span>
                        </div>
                        <div className="mt-1 ml-10 text-sm">
                            <span>{comment.payload}</span></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
