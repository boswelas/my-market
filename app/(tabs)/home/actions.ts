"use server";

import db from "@/lib/database";
import getSession from "@/lib/session";


export async function getMoreProducts(page: number) {
    const products = await db.product.findMany({
        where: {
            visible: true,
        },
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        skip: page * 4,
        take: 4,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

export async function checkLoggedIn() {
    const session = await getSession();
    return typeof session.id === "number"
}
