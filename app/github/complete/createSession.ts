import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function createSession(id: number) {
    const session = await getSession();
    session.id = id;
    await session.save();
    return redirect("/profile");
}




