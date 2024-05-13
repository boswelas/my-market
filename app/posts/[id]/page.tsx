import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import db from "@/lib/database";
import LikeButton from "@/components/like-button";
import CloseButton from "@/components/close-button";
import SubmitComment from "@/components/comment-submit";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { commentOnPost } from "./actions";


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

const getCachedPost = unstable_cache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60,
});

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

async function getComments(id: number) {
    const comments = await db.comment.findMany({
        where: {
            postId: id,
        },
        select: {
            payload: true,
            updated_at: true,
            user: {
                select: {
                    username: true,
                    avatar: true,
                }
            }
        },
    });
    return comments;
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
    const comments = await getComments(post.id);


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
                    <SubmitComment postId={id} />
                <div>
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    {comments.map((comment, index) => (
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
            </div>
        </div>
    );
}
