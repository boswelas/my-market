import db from "@/lib/database";
import getSession from "@/lib/session";
import Link from "next/link";
import Image from "next/image";

async function getPastProducts(userId: number) {
    const products = await db.product.findMany({
        where: {
            userId,
            sold: true,
        },
        select: {
            id: true,
            title: true,
            photo: true,
            created_at: true,

        },
        take: 3,
        orderBy: {
            created_at: "desc",
        }
    });
    return products;
}

export default async function PastProducts() {
    const session = await getSession();
    const user = await session.id;
    // const user = 8;
    if (user) {
        const products = await getPastProducts(user);
        if (products.length !== 0) {
            return (
                <div className="h-56 w-full bg-neutral-800 rounded-xl">
                    <h1 className="text-center font-semibold text-xl my-2">Past Purchases</h1>
                    <div className="relative">
                        <div className="grid grid-cols-3">
                            {products.map((product) => (
                                <Link key={product.id} href={`/products/${product.id}`} className="flex flex-col items-center mx-auto w-40 ">
                                    <div className="relative w-full h-28 rounded-md overflow-hidden">
                                        <Image fill src={product.photo} alt={product.title} className="object-cover" />
                                    </div>
                                    <div className="flex flex-col items-center mt-2 text-center">
                                        <span className="text-md text-white text-center">{product.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-end mt-2 mr-2">
                            <Link href="/user-products" className="text-blue-500 text-sm">View All</Link>
                        </div>
                    </div>
                </div>)

        } else {
            return (
                <div>
                    <h1 className="text-center font-semibold text-xl my-2">Past Products</h1>
                    <div className="flex justify-center items-center h-36">
                        <div className="text-neutral-500">
                            <span>No products to display</span>
                        </div>
                    </div>
                </div>
            );
        }

    }
}