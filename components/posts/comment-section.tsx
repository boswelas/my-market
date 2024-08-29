"use client"
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";
import { commentOnPost } from "@/app/posts/[id]/actions";
import { useOptimistic, useRef } from "react";
import Link from "next/link";
import CommentList from "./comment-list";

interface userProps {
    username?: string;
    avatar?: string | null;
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
    const formRef = useRef<HTMLFormElement>(null);

    const [optimisticState, reducerFn] = useOptimistic(
        comments,
        (previousComments, payload: CommentSectionProps) => [...previousComments, payload]
    );


    const interceptAction = async (_: any, formData: FormData) => {

        const newComment = {
            updated_at: new Date(),
            user: {
                username: user.username || "anonymous",
                avatar: user.avatar || null,
            },
            payload: formData.get("payload")!.toString(),
        }
        reducerFn(newComment);
        formRef.current?.reset();
        return commentOnPost(_, formData);
    }
    const [_, action] = useFormState(interceptAction, null);

    return (
        <div className="w-full">
            {user.username ? (<div>
                <form ref={formRef} action={action} className="flex relative" >
                    <input type="hidden" name="postId" value={postId} />

                    <input required
                        className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition
    ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                        type="text"
                        name="payload"
                        placeholder="Write message..."
                    />
                    <button className="absolute right-0">
                        <ArrowUpCircleIcon className="size-10 text-emerald-600 transition-colors hover:text-emerald-500" />
                    </button>
                </form>
            </div>) :
                (
                    <div className="text-lg">Want to join in the conversation? <Link href="/home-login" className="text-emerald-600 underline font-semibold hover:text-emerald-500">Log in!</Link></div>
                )}

            <div className="mt-5">
                <CommentList comments={optimisticState} />
            </div>
        </div>

    )
}
