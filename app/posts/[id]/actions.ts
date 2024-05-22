"use server";

import db from "@/lib/database";
import getSession from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function likePost(postId: number) {
    const session = await getSession();
    try {
        await db.like.create({
            data: {
                postId,
                userId: session.id!,
            },
        });
        revalidateTag(`like-status-${postId}`);
    } catch (e) { }
};

export async function dislikePost(postId: number) {
    try {
        const session = await getSession();
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId: session.id!,
                },
            },
        });
        revalidateTag(`like-status-${postId}`);
    } catch (e) { }
};

const commentSchema = z.object({
    postId: z.coerce.number({
        required_error: "",
    }),
    payload: z.string({
        required_error: "Comment is required",
    }),
});

export async function commentOnPost(_: any, formData: FormData) {

    const data = {
        postId: formData.get("postId"),
        payload: formData.get("payload"),
    };
    const result = commentSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            const comment = await db.comment.create({
                data: {
                    postId: Number(result.data.postId),
                    payload: result.data.payload,
                    userId: session.id,
                },
                select: {
                    id: true,
                },
            });
            revalidatePath(`/posts/${result.data.postId}`);
        }
    }
};

export async function checkExistingChat(userId: number, postUser: number) {
    try {
        const isChat = await db.chatRoom.findFirst({
            where: {
                AND: [
                    { users: { some: { id: userId } } },
                    { users: { some: { id: postUser } } }
                ],
            },
            select: { id: true },
        });

        return isChat ? isChat.id : null;
    } catch (error) {
        console.error('Error checking existing chat:', error);
        throw error;
    }
};

export async function createChatRoom(userId: number, postUser: number) {
    try {
        const room = await db.chatRoom.create({
            data: {
                users: {
                    connect: [{ id: userId }, { id: postUser }],
                },
            },
            select: { id: true },
        });

        return room.id;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};

export async function deletePost(postId: number) {
    try {
        const session = await getSession();
        const user = await session.id;
        const deletePostFromDB = await db.post.findUnique({
            where: {
                id: postId,
            }, select: {
                userId: true,
            }
        });
        if (deletePostFromDB!.userId === user) {
            await db.post.delete({
                where: {
                    id: postId,
                }
            });
            revalidatePath("/life")
            redirect("/life")
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}
