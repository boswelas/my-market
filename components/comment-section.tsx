import CommentList from "./comment-list"
import SubmitComment from "./comment-submit"

interface CommentSectionProps {
    updated_at: Date,
    user: {
        username: string;
        avatar: string | null;
    },
    payload: string;

}


export default function CommentSection({ postId, comments }: { postId: number; comments: CommentSectionProps[] }) {
    return (
        <div className="w-full">
            <div>
                <SubmitComment postId={postId} />
            </div>
            <div className="mt-5">
                <CommentList comments={comments} />
            </div>
        </div>

    )
}
