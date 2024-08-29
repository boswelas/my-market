"use client"
import { commentOnPost } from "@/app/posts/[id]/actions";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";



interface SubmitCommentProps {
    postId: number;
}



export default function SubmitComment({ postId }: SubmitCommentProps) {
    const [state, action] = useFormState(commentOnPost, null);
    return (
        <div className="w-full">
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
                    <ArrowUpCircleIcon className="size-10 text-emerald-600 transition-colors hover:text-emerald-500" />
                </button>
            </form>
        </div>
    )
}
