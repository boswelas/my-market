import CloseButton from "@/components/close-button";
import db from "@/lib/database";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { formatToDollar } from "@/lib/utils";
import DeleteProductModal from "@/components/delete-product";
import { checkExistingChat, createChatRoom } from "@/app/products/[id]/actions";



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

export default async function Modal({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);
    const getChat = async () => {
        "use server";
        const session = await getSession();
        if (!session.id) {
            redirect(`/home-login`)
        }
        console.log("product id: ", product.id);
        console.log("userId: ", session.id);
        console.log("owner: ", product.userId)
        let room = await checkExistingChat(session.id!, product.userId, product.id);
        console.log(room);
        if (!room) {
            console.log("creating room");
            room = await createChatRoom(session.id!, product.userId, product.id);
        }
        redirect(`../chats/${room}`)
    }

    const editProduct = async () => {
        "use server"
        redirect(`./edit/${product.id}`)
    };
    return (
        <div>
            <div className="flex flex-col items-center">
                <div className="fixed mx-auto w-[75%] sm:w-[80%] md:w-[80%] lg:w-[55%] h-full max-h-screen z-50 flex items-center justify-center bg-black bg-opacity-80 top-0">
                    <div className="absolute right-[2%] top-[2%] sm:right-[2.5%] lg:right-[5%] sm:top-[2.5%] lg:top-[5%]">
                        <CloseButton />
                    </div>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1 items-center">
                        <div className="flex justify-center w-64 h-64 sm:w-96 sm:h-96 p-4">
                            <div className="relative aspect-square rounded-lg">
                                <Image fill src={product.photo} alt={product.title} className="object-cover" />
                            </div>
                        </div>
                        <div className="">
                            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                                <div className="size-10 rounded-full overflow-hidden">
                                    <Image
                                        src={`${product.user.avatar}`}
                                        width={40}
                                        height={40}
                                        alt={product.user.username}
                                    />

                                </div>
                                <div>
                                    <h3>{product.user.username}</h3>
                                </div>
                            </div>
                            <div className="p-5">
                                <h1 className="text-2xl font-semibold">{product.title}</h1>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                    {isOwner ? (
                        <div className="absolute bottom-0 left-0 right-0 mx-auto w-full grid grid-cols-3 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
                            <span className="font-semibold text-xl">
                                ${formatToDollar(product.price)}
                            </span>
                            <form action={editProduct}>
                                <button className="bg-emerald-600 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-emerald-500">
                                    Edit product
                                </button></form>
                            <DeleteProductModal productId={product.id} />
                        </div>
                    ) : <div className="absolute bottom-0 left-0 right-0 w-full grid grid-cols-2 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
                        <span className="font-semibold text-xl flex items-center sm:pl-8">
                            ${formatToDollar(product.price)}
                        </span> <form action={getChat} className="flex items-center ml-14 sm:ml-64">
                            <button
                                className="bg-emerald-600 px-5 py-2.5 rounded-md text-white font-semibold flex items-center">
                                Chat
                            </button>
                        </form>
                    </div>}
                </div>
            </div>
        </div>
    );
}
