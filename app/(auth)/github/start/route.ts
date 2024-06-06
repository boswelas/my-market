import { redirect } from "next/navigation";

export function GET() {
    const baseURL = "https://github.com/login/oauth/authorize";
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope: "read:user, user:email",
        allow_signup: "true",
    };
    const formattedParams = new URLSearchParams(params).toString();
    const finalURL = `${baseURL}?${formattedParams}`;
    console.log("called github start");
    console.log("final url: ", finalURL);
    return redirect(finalURL);
}
