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
            <div className="mt-10 mb-2">
                <h3 className="text-xl font-semibold">Comments</h3>
            </div>
            <div>
                {comments.map((comment, index) => (
                    <div key={index} className="flex items-center gap-3 mb-5">
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
        </div>
    );
}
