import CloseButton from "@/components/close-button";
import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/database";
import getSession from "@/lib/session";

async function getProducts(userId: number) {
    const products = await db.product.findMany({
        where: {
            userId,
            sold: true,
        },
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        orderBy: {
            created_at: "desc",
        }
    });
    return products;
}

export default async function UserProducts() {
    const session = await getSession();
    const user = await session.id;
    if (user) {
        const products = await getProducts(user);
        return (
            <div>
                <CloseButton />
                <h1 className="text-2xl font-semibold">Past Products</h1>
                <div className="p-5 flex flex-col gap-5">
                    {products.map((product) => (
                        <ListProduct key={product.id} {...product} />
                    ))}
                </div>
            </div>
        )
    }
}
