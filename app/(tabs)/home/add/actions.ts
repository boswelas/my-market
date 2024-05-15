"use server";

import { z } from "zod";
import fs from "fs/promises";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/database";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/components/firebase"
import { createHash } from 'crypto';
import { randomBytes } from 'crypto';


const productSchema = z.object({
    photo: z.string({
        required_error: "Photo is required",
    }),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
    price: z.coerce.number({
        required_error: "Price is required",
    }),
});

export async function uploadProduct(_: any, formData: FormData) {
    const session = await getSession();
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };
    if (data.photo instanceof File) {
        if (session.id) {
            const timestamp = Date.now().toString();
            const hashedUserId = createHash('sha256').update(session.id.toString()).digest('hex');

            const storageRef = await ref(storage, 'images/' + `${hashedUserId}` + `${timestamp}`);
            const uploadTask = await uploadBytes(storageRef, data.photo);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            console.log('File available at', downloadURL);
            data.photo = `${downloadURL}`;
        }
    }
    const result = productSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const product = await db.product.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                price: result.data.price,
                photo: result.data.photo,
                user: {
                    connect: {
                        id: session.id,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        revalidatePath("/home");
        redirect(`/products/${product.id}`);
    }
}

