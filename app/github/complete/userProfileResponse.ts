export async function userProfileResponse(access_token: string) {
    const { id, avatar_url, login } = await (await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: "no-cache",
    })).json();
    return { id, avatar_url, login };
}
