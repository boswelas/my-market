import ProductList from "@/components/product-list";
import db from "@/lib/database";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

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
        take: 5,
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
        <div className=" mb-20">
            <ProductList initialProducts={initialProducts} />
            <Link href="/home/add" className="bg-emerald-600 flex items-center justify-center rounded-full 
            size-16 fixed bottom-24 right-[25%] text-white transition-colors hover:bg-emerald-500">
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
