import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD; // Load the password from the .env file

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Check if the user has already logged in by verifying the cookie
    const siteAccessCookie = request.cookies.get('site_access');
    const hasAccess = siteAccessCookie?.value === PASSWORD;

    // If the cookie does not exist or the value is incorrect, redirect to the login page
    if (!hasAccess) {
        url.pathname = '/login';
        url.search = ''; // Clear any query parameters
        const redirectUrl = `${url.origin}${url.pathname}`;
        return NextResponse.redirect(redirectUrl);
    }

    // Allow access if the user is authenticated
    return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
    matcher: '/((?!login|api|_next|static).*)', // Exclude login, API routes, and static files
};