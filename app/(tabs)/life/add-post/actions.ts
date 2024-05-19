"use server";

import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/database";



const postSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
});

export async function uploadPost(_: any, formData: FormData) {
    const session = await getSession();
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
    };

    const result = postSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const post = await db.post.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                user: {
                    connect: {
                        id: session.id!,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        revalidatePath("/life");
        redirect(`/life`);
    }
}

