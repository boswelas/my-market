"use client"
import { deletePost } from "@/app/posts/[id]/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function DeletePostButton({ postId }: { postId: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        try {
            deletePost(postId);
        } catch (error) {
            console.error('Error on button click:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <button onClick={onClick} className="font-red" disabled={loading}>
                Delete
            </button>
        </div>
    )
}
