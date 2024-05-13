import { InitialComments } from "@/app/posts/[id]/page";
import CommentList from "./comment-list"
import SubmitComment from "./comment-submit"

interface CommentSectionProps {
    postId: number;
    initialComments: InitialComments;
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
    return (
        <div className="w-full">
            <div>
                <SubmitComment postId={postId} />
            </div>
            <div className="mt-5">
                <CommentList initialComments={initialComments} />
            </div>
        </div>

    )
}
