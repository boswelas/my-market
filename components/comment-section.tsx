"use client"
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import CommentList from "./comment-list"
import { useFormState } from "react-dom";
import { commentOnPost } from "@/app/posts/[id]/actions";
import { useOptimistic } from "react";

interface userProps {
    username: string;
    avatar: string | null;
}

interface CommentSectionProps {
    updated_at: Date,
    user: {
        username: string;
        avatar: string | null;
    },
    payload: string;
}




export default function CommentSection({ postId, user, comments }: { postId: number; user: userProps; comments: CommentSectionProps[] }) {
    const [optimisticState, reducerFn] = useOptimistic(
        comments,
        (previousComments, payload: CommentSectionProps) => [...previousComments, payload]
    );


    const interceptAction = async (_: any, formData: FormData) => {
        const newComment = {
            updated_at: new Date(),
            user: {
                username: user.username,
                avatar: user.avatar,
            },
            payload: formData.get("payload")!.toString(),
        }
        reducerFn(newComment);
        return commentOnPost(_, formData);
    }
    const [_, action] = useFormState(interceptAction, null);

    return (
        <div className="w-full">
            <div>
                <form action={action} className="flex relative" >
                    <input type="hidden" name="postId" value={postId} />

                    <input required
                        className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition
    ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                        type="text"
                        name="payload"
                        placeholder="Write message..."
                    />
                    <button className="absolute right-0">
                        <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                    </button>
                </form>            </div>
            <div className="mt-5">
                <CommentList comments={optimisticState} />
            </div>
        </div>

    )
}
