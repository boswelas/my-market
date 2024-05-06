import db from "@/lib/database";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { accessTokenResponse } from "./getAccessToken";
import { userProfileResponse } from "./userProfileResponse";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return notFound();
    }
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();
    const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const { error, access_token } = await accessTokenResponse(accessTokenUrl);

    if (error) {
        return new Response(null, {
            status: 400,
        });
    }
    const { id, avatar_url, login } = await userProfileResponse(access_token);
    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        },
        select: {
            id: true
        }
    });
    if (user) {
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/profile");
    }
    const newUser = await db.user.create({
        data: {
            username: login,
            github_id: id + "",
            avatar: avatar_url,
        },
        select: {
            id: true,
        }
    });
    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");
}

