
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('Google Client ID is not defined in environment variables');
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: 'https://my-market-henna.vercel.app/google/complete',
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        include_granted_scopes: 'true',
        state: 'pass-through value',
    });

    const authUrl = `${oauth2Endpoint}?${params.toString()}`;


    const response = NextResponse.redirect(authUrl);
    response.headers.set("Cache-Control", "no-store");

    return response;
}
