import PostDetails from "@/components/posts/post-details";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";




export default async function PostDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }

    return (
        <PostDetails postId={id} />
    );
}
