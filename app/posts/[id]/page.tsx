import PostDetails from "@/components/post-details";
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
    const session = await getSession();
    const userId = await session.id!;
    return (
        <PostDetails userId={userId} postId={id} />
    );
}
