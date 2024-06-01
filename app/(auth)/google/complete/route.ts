import db from "@/lib/database";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return new Response(null, {
            status: 400,
        });
    }

    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        redirect_uri: 'https://my-market-henna.vercel.app/google/complete',
        grant_type: 'authorization_code',
    }).toString();

    const accessTokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: accessTokenParams,
    });

    const { error, access_token } = await accessTokenResponse.json();
    if (error || !access_token) {
        return new Response(null, {
            status: 400,
        });
    }

    const userProfileResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: "no-cache",
    });

    const { picture, email } = await userProfileResponse.json();
    const username = email.split("@")[0];
    let user = await db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    });

    // If the user doesn't exist, create a new user
    if (!user) {
        user = await db.user.create({
            data: {
                username: username,
                email: email,
                avatar: picture,
            },
            select: {
                id: true,
            },
        });
    }


    const session = await getSession();
    session.id = user.id;
    console.log(session.id);
    await session.save();
    console.log("session saved")
    return redirect("/profile");
}
