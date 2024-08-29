import CloseButton from "@/components/close-button";
import EditProductForm from "@/components/products/edit-product-form";
import db from "@/lib/database";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}

async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return product;
}

export async function generateMetadata({ params
}: {
    params: { id: string }
}) {
    const product = await getProduct(Number(params.id));
    return {
        title: product?.title,
    };
}

export default async function editProduct({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);

    if (!isOwner) {
        return notFound();
    } else {
        return (
            <>
                <div className="flex flex-col items-center max-h-screen">
                    <div className="absolute right-[2%] sm:right-[5%] lg:right-[10%] sm:top-[2.5%] lg:top-[5%]">
                        <CloseButton />
                    </div>
                    <div className="">
                        <EditProductForm
                            id={product.id}
                            title={product.title}
                            photo={product.photo}
                            price={product.price}
                            description={product.description}
                            userId={product.userId} />
                    </div>
                </div>
            </>
        );
    }
}
