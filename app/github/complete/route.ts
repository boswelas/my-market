import db from "@/lib/database";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { accessTokenResponse } from "./getAccessToken";
import { userProfileResponse } from "./userProfileResponse";
import { userEmailResponse } from "./userEmailResponse";
import { createSession } from "./createSession";

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
    const email = await userEmailResponse(access_token);
    console.log(email);
    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        },
        select: {
            id: true
        }
    });
    if (user) {
        return createSession(user.id);
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
    return createSession(newUser.id);
}

