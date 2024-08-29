import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import db from "@/lib/database";
import LikeButton from "@/components/posts/like-button";
import CloseButton from "@/components/close-button";
import CommentSection from "@/components/posts/comment-section";
import { notFound } from "next/navigation";
import getSession from "@/lib/session";


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

export default async function PostDetails({ postId }: { postId: number }) {
    const post = await getCachedPost(postId);
    if (!post) {
        return notFound();
    }

    const comments = post.comments;
    const session = await getSession();
    const userId = await session?.id;
    const user = userId ? await getCurrentUser(userId) : undefined;
    const currentUser = user || { username: '', avatar: null };
    let likeCount = 0;
    let isLiked = false;
    let isLoggedIn = false;

    if (userId) {
        isLoggedIn = true;
        const likeStatus = await getCachedLikeStatus(postId, userId);
        likeCount = likeStatus.likeCount;
        isLiked = likeStatus.isLiked;
    } else {
        likeCount = await db.like.count({
            where: {
                postId,
            },
        });
    }


    return (
        <div className="flex flex-col items-center">
            <div className="sm:w-[35em] md:w-[45em] lg:w-[55em]">
                <div className="text-white ">
                    <div className="absolute right-[2%] sm:right-[5%] lg:right-[10%] sm:top-[2.5%] lg:top-[5%]">
                        <CloseButton /></div>
                    <div>
                        <div className="mt-10 bg-neutral-800 bg-opacity-70 p-4 rounded-lg">
                            <div className="ml-2">
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
                                    </div>
                                        <div className="text-xs">
                                            <span>{formatToTimeAgo(post.created_at.toString())}</span>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold mt-4 mb-2">{post.title}</h2>
                                <p className="mb-8">{post.description}</p>
                                <div className="flex flex-col gap-5 items-start">
                                    <div className="flex sm:ml-[70%] md:ml-[75%] lg:ml-[80%] items-center gap-2 text-neutral-400 text-sm ">
                                        <EyeIcon className="size-5" />
                                        <span>{post.views}</span>
                                        {isLoggedIn ? (<LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} isDisabled={false} />) :
                                            (<LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} isDisabled={true} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 ml-4 mr-4">
                            {isLoggedIn ? (<CommentSection postId={postId} user={currentUser} comments={comments} />) :
                                (<CommentSection postId={postId} user={currentUser} comments={comments} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
