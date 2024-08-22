import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
    "/google/start": true,
    "/google/complete": true,
    "/home": true,
    "/home-login": true,
    "/board": true,
    "/chat": true,
};

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const { pathname } = request.nextUrl;
    const exists = publicOnlyUrls[pathname];
    const noCacheRoutes = ["/github/start", "/github/complete", "/google/start", "/google/complete"]; // routes that shouldn't be cached

    // Handle no-cache routes
    if (noCacheRoutes.includes(pathname)) {
        return NextResponse.next({
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    // Dynamic check for /posts/{id}
    const isPostRoute = pathname.startsWith("/posts/") && pathname.match(/^\/posts\/\d+$/);
    const isProductsRoute = pathname.startsWith("/products/") && pathname.match(/^\/products\/\d+$/);


    if (!session.id) {
        if (!exists && !isPostRoute && !isProductsRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
