import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import db from "@/lib/database";
import LikeButton from "@/components/like-button";
import CloseButton from "@/components/close-button";
import CommentSection from "@/components/comment-section";

const getCachedPost = unstable_cache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60,
});

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

async function getLikeStatus(postId: number) {
    const session = await getSession();
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId: session.id!,
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

function getCachedLikeStatus(postId: number) {
    const cachedOperation = unstable_cache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId);
}

async function getCurrentUser() {
    try {
        const session = await getSession();
        const userId = await session.id!;
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

export default async function PostDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }

    const { likeCount, isLiked } = await getCachedLikeStatus(id);
    const comments = post.comments;
    const user = await getCurrentUser();
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
                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>
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
                    <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
                </div>
                <CommentSection postId={id} user={currentUser} comments={comments} />
            </div>
        </div>
    );
}
