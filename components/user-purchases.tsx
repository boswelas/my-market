import db from "@/lib/database";
import getSession from "@/lib/session";
import Link from "next/link";
import Image from "next/image";

async function getPurchases(userId: number) {
    const purchases = await db.purchase.findMany({
        where: {
            buyerId: userId,
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    photo: true,
                    description: true,
                }
            }
        },
        take: 4,
    });
    return purchases;
}

export default async function UserPurchases() {
    const session = await getSession();
    const user = await session.id;
    // const user = 8;
    if (user) {
        const purchases = await getPurchases(user);
        if (purchases.length !== 0) {
            return (
                <div className="h-56 w-full bg-neutral-800 rounded-xl">
                    <h1 className="text-center font-semibold text-xl my-1">My Purchases</h1>
                    <div className="relative">
                        <div className="grid grid-cols-4">
                            {purchases.map((purchase) => (
                                <Link key={purchase.product.id} href={`/products/${purchase.product.id}`} className="flex flex-col items-center mx-auto w-40 ">
                                    <div className="relative w-28 h-28 rounded-md overflow-hidden">
                                        <Image fill src={purchase.product.photo} alt={purchase.product.title} className="object-cover" />
                                    </div>
                                    <div className="flex flex-col items-center mt-2 text-center">
                                        <span className="text-md text-white text-center">{purchase.product.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-end mr-4">
                            <Link href="/user-products" className="text-blue-500 text-sm">View All</Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h1 className="text-center font-semibold text-xl my-2">My Purchases</h1>
                    <div className="flex justify-center items-center h-36">
                        <div className="text-neutral-500">
                            <span>No purchases to display</span>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
