export async function userEmailResponse(access_token: string) {
    const emails = await (await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: "no-cache",
    })).json();
    const primaryEmail = emails.find((email: { primary: boolean; }) => email.primary === true);
    return primaryEmail.email;
};


