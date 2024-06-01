import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number
    access_token?: string,
}

export default function getSession() {
    return getIronSession<SessionContent>(cookies(), {
        cookieName: "user-market",
        password: process.env.COOKIE_PASSWORD!,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        }
    });
}
