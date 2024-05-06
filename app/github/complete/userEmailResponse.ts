export async function userEmailResponse(access_token: string) {
    const { email } = await (await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: "no-cache",
    })).json();
    return { email };
}
