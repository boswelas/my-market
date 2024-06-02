import UserProducts from "@/components/user-products";
import UserPurchases from "@/components/user-purchases";
import db from "@/lib/database";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    }
    return (
        <div className="p-5 flex flex-col gap-4">
            <div >
                <h1>Welcome {user?.username}!</h1>
                <form action={logOut}>
                    <button>Log out</button>
                </form>
            </div>
            <div className="h-56 w-full bg-neutral-800 rounded-xl">
                <h1 className="text-center font-semibold text-xl my-2">My Products</h1>
                <UserProducts />
            </div>
            <div className="h-56 w-full bg-neutral-800 rounded-xl">
                <h1 className="text-center font-semibold text-xl my-2">My Purchases</h1>
                <UserPurchases />
            </div>
        </div>
    )
}
