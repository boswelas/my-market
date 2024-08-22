import { GetPostTime } from "@/lib/utils";
import Image from "next/image";

interface Comment {
    updated_at: Date;
    user: {
        username: string;
        avatar: string | null;
    };
    payload: string;
}

interface CommentListProps {
    comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {

    return (
        <div>
            <h3 className="text-xl font-semibold mt-1 mb-1">Comments</h3>
            {comments.map((comment, index) => (
                <div key={index} className="flex items-center gap-3 mt-5">
                    <div>
                        <div className="flex items-center gap-3">
                            {comment.user.avatar && (
                                <Image
                                    width={28}
                                    height={28}
                                    className="size-7 rounded-full"
                                    src={comment.user.avatar}
                                    alt={comment.user.username}
                                />
                            )}
                            <span className="text-xs font-bold">{comment.user.username}</span>
                            <span>·</span>
                            <span className="text-xs text-neutral-400">{GetPostTime(comment.updated_at)}</span>
                        </div>
                        <div className="ml-10">
                            <span>{comment.payload}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
