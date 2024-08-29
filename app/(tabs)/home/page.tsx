import ProductList from "@/components/home/product-list";
import db from "@/lib/database";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
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
        take: 8,
        orderBy: {
            created_at: "desc",
        }
    });
    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export const metadata = {
    title: "Home",
};

export const revalidate = 30;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div className="mt-20">
            <ProductList initialProducts={initialProducts} />

        </div>
    );
}
