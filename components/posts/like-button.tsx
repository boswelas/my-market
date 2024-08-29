"use client"
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean,
    likeCount: number;
    postId: number,
    isDisabled: boolean
}

export default function LikeButton({ isLiked, likeCount, postId, isDisabled }: LikeButtonProps) {
    const [state, reducerFn] = useOptimistic({ isLiked, likeCount }, (previousState, payload) => {
        return {
            isLiked: !previousState.isLiked,
            likeCount: previousState.isLiked ? previousState.likeCount - 1 : previousState.likeCount + 1,
        }
    });
    const onClick = async () => {
        reducerFn(undefined);
        if (isLiked) {
            await dislikePost(postId);
        } else {
            await likePost(postId);
        }
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2  text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${state.isLiked
                ? "bg-emerald-600 text-white border-emerald-600"
                : "hover:bg-neutral-800"
                } ${isDisabled ? "disabled:true" : "disabled:false"}`}
        >
            {state.isLiked ? (
                <HandThumbUpIcon className="size-5" />
            ) : (
                <OutlineHandThumbUpIcon className="size-5" />
            )}
            <span>Like ({likeCount})</span>
        </button>
    )
}
