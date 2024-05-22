import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import db from "@/lib/database";
import LikeButton from "@/components/like-button";
import CloseButton from "@/components/close-button";
import CommentSection from "@/components/comment-section";
import { notFound } from "next/navigation";
import ChatButton from "./chat-button";

async function getCurrentUser(userId: number) {
    try {

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                username: true,
                avatar: true,
            },
        });
        return user;
    } catch (e) {
        return null;
    }
}


async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                }, comments: {
                    select: {
                        payload: true,
                        updated_at: true,
                        user: {
                            select: {
                                avatar: true,
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
        return post;
    } catch (e) {
        return null;
    }
}

function getCachedLikeStatus(postId: number, userId: number) {
    const cachedOperation = unstable_cache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId, userId);
}


const getCachedPost = unstable_cache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {

    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

export default async function PostDetails({ userId, postId }: { userId: number; postId: number }) {
    const post = await getCachedPost(postId);
    if (!post) {
        return notFound();
    }
    const { likeCount, isLiked } = await getCachedLikeStatus(postId, userId);
    const comments = post.comments;
    const user = await getCurrentUser(userId);
    const currentUser = user || { username: '', avatar: null };
    return (
        <div className="p-5 text-white">
            <CloseButton />
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div><div className="flex items-center">
                    <span className="text-sm font-semibold mr-3">{post.user.username}  </span>
                    {userId !== post.user.id && <ChatButton userId={userId} postUser={post.user.id} />}                </div>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>{post.views}</span>
                    <LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} />
                </div>
                <CommentSection postId={postId} user={currentUser} comments={comments} />
            </div>
        </div>
    )

}
