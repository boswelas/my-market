"use server";

import db from "@/lib/database";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";


export default async function deleteProduct(productId: number) {
    const session = await getSession();
    const user = await session.id;
    if (!user) {
        return notFound();
    }
    const owner = await db.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            userId: true,
        }
    });
    if (user === owner!.userId) {
        const deleteProd = await db.product.update({
            where: {
                id: productId,
            }, data: {
                visible: false
            }
        });
        revalidatePath(`../home`)
        redirect(`../profile`)
    } else {
        return notFound();
    }
}

