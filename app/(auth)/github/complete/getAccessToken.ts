export async function accessTokenResponse(accessTokenUrl: string) {
    const { error, access_token } = await await (await fetch(accessTokenUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    return { error, access_token };
}
