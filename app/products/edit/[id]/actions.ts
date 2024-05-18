"use server";

import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/database";
import getSession from "@/lib/session";
import { createHash } from "crypto";
import { storage } from "@/components/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { randomBytes } from 'crypto';



const productSchema = z.object({
    id: z.coerce.number({}),
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

export async function updateProduct(_: any, formData: FormData) {
    const session = await getSession();

    const data = {
        id: formData.get("id"),
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };
    console.log(data.photo);
    if (data.photo instanceof File) {
        console.log("photo is File");
        if (session.id) {
            const timestamp = Date.now().toString();
            const hashedUserId = createHash('sha256').update(session.id.toString()).digest('hex');
            const storageRef = await ref(storage, 'images/' + `${hashedUserId}` + `${timestamp}`);
            const uploadTask = await uploadBytes(storageRef, data.photo);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            console.log('File available at', downloadURL);
            data.photo = `${downloadURL}`;
        }
    } else {
        data.photo = formData.get('existingPhoto');
    }
    const result = productSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        const product = await db.product.update({
            where: {
                id: result.data.id,
            },
            data: {
                title: result.data.title,
                description: result.data.description,
                price: result.data.price,
                photo: result.data.photo,
            },
        });
        revalidatePath("/home");
        redirect(`/products/${product.id}`);
    }

}
