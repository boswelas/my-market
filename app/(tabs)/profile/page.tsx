import UserProducts from "@/components/profile/user-products";
import UserPurchases from "@/components/profile/user-purchases";
import db from "@/lib/database";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getRatings } from "./actions";
import { Rating } from "@mui/material";
import PastProducts from "@/components/profile/past-products";


async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
                // id: 3
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

    const userRating = async () => {
        const rating = await getRatings(user.id);
        return rating;
    }

    const rating = await userRating();

    return (
        <div className="p-3 flex flex-col h-screen items-center">
            <div className="flex flex-col w-[35em] md:w-[45em] lg:w-[55em]">
                <div className="flex-1 overflow-y-auto no-scrollbar mt-20 ">
                    < div className="flex justify-between">
                        <h1>Welcome {user.username}!</h1>
                        <form action={logOut}>
                            <button className="">Log out</button>
                        </form>
                    </div >
                    <div>
                        <Rating size="small" name="read-only" value={rating} precision={0.5} readOnly />
                    </div>
                    <div className="p-5 flex flex-col gap-4">

                        <div className="h-52 w-full bg-neutral-800 rounded-xl">
                            <UserPurchases />
                        </div>
                        <div className="h-52 w-full bg-neutral-800 rounded-xl">
                            <UserProducts />
                        </div>
                        <div className="h-52 w-full bg-neutral-800 rounded-xl">
                            <PastProducts />
                        </div>
                    </div >
                </div>
            </div>
        </div>
    )
}
