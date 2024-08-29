import CloseButton from "@/components/close-button";
import ListProduct from "@/components/home/list-product";
import ProductList from "@/components/home/product-list";
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
            <div className="flex flex-col items-center">
                <div className="">
                    <div className="absolute right-[2%] sm:right-[5%] lg:right-[10%] sm:top-[2.5%] lg:top-[5%]">
                        <CloseButton />
                    </div>
                    <h1 className="text-2xl font-semibold mt-10 mb-5">Past Products</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ListProduct key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
