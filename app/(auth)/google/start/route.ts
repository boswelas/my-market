
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// Handler for GET requests
export async function GET(request: NextRequest) {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Ensure the environment variable is defined
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('Google Client ID is not defined in environment variables');
    }

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: 'https://my-market-henna.vercel.app/google/complete',
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        include_granted_scopes: 'true',
        state: 'pass-through value',
    });

    // Construct the full URL
    const authUrl = `${oauth2Endpoint}?${params.toString()}`;

    // Redirect the user to Google's OAuth 2.0 endpoint
    return redirect(authUrl);
}
