import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import type { Credentials } from 'google-auth-library';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state'); // Contains user ID

        if (!code || !state) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session || session.user.id !== state) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        if (!tokens.access_token) {
            throw new Error('No access token received');
        }

        // Store tokens in database
        const { error: tokenError } = await supabase
            .from('user_calendar_tokens')
            .upsert({
                user_id: session.user.id,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token ?? null,
                token_type: tokens.token_type ?? 'Bearer',
                scope: Array.isArray(tokens.scope) ? tokens.scope.join(' ') : tokens.scope,
                expiry_date: tokens.expiry_date,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (tokenError) throw tokenError;

        // Redirect to success page
        return NextResponse.redirect(new URL('/dashboard/calendar/success', request.url));

    } catch (error) {
        console.error('Error in calendar callback:', error);
        // Redirect to error page with error message
        const errorUrl = new URL('/dashboard/calendar/error', request.url);
        errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.redirect(errorUrl);
    }
}

    } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return NextResponse.redirect(new URL('/dashboard/calendar/error', request.url));
}
}