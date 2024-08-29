import CloseButton from "@/components/close-button";
import ListProduct from "@/components/home/list-product";
import ProductList from "@/components/home/product-list";
import db from "@/lib/database";
import getSession from "@/lib/session";

async function getPurchases(userId: number) {
    const purchases = await db.purchase.findMany({
        where: {
            buyerId: userId,

        },
        select: {
            product: {
                select: {
                    id: true,
                    title: true,
                    photo: true,
                    price: true,
                    description: true,
                    created_at: true,
                }
            }
        },
    });
    return purchases;
}

export default async function UserProducts() {
    const session = await getSession();
    const user = await session.id;
    if (user) {
        const purchases = await getPurchases(user);
        return (
            <div className="flex flex-col items-center">
                <div>
                    <div className="absolute right-[2%] sm:right-[5%] lg:right-[10%] sm:top-[2.5%] lg:top-[5%]">
                        <CloseButton />
                    </div>
                    <h1 className="text-2xl font-semibold mt-10 mb-5">Purchases</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {purchases.map((purchase) => (
                            <ListProduct title={purchase.product.title} price={purchase.product.price} created_at={purchase.product.created_at} photo={purchase.product.photo} id={purchase.product.id} key={purchase.product.id} {...purchase} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
