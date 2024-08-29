import db from "@/lib/database";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { HandThumbUpIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getPosts() {
    const posts = await db.post.findMany({
        orderBy: {
            created_at: 'desc',
        },
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            created_at: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                }
            }
        }
    });
    return posts;
}

export const metadata = {
    title: "Posts"
}

export default async function Board() {
    const posts = await getPosts();
    const session = await getSession();
    return (
        <div className="p-5 flex flex-col items-center mt-16">
            <div className="w-[20em] sm:w-[30em] md:w-[40em] lg:w-[50em]">
                {session.id &&
                    <div className="ml-[84%]">
                        <Link href="/board/add-post" className="border-emerald-600 border-2 flex items-center justify-center 
            py-2 px-2 rounded-3xl text-white transition-colors hover:bg-emerald-600">
                            <PlusIcon className="size-6 mr-1 stroke-2" /> New Post
                        </Link>
                    </div>
                }

                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="pb-5  border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
                    >
                        <div className="my-3">
                            <h2 className="text-white text-lg font-semibold mt-2">{post.title}</h2>
                            <p>{post.description}</p>
                            <div className="flex items-center justify-between text-sm mt-4" >
                                <div className="flex gap-4 items-center ">
                                    <span>{formatToTimeAgo(post.created_at.toString())}</span>
                                    <span>·</span>
                                    <span>{post.views} views</span>
                                </div>
                                <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                                    <span>
                                        <HandThumbUpIcon className="size-4" />
                                        {post._count.likes}
                                    </span>
                                    <span>
                                        <ChatBubbleBottomCenterIcon className="size-4" />
                                        {post._count.comments}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    );
}
