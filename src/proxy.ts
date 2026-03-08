import { betterFetch } from "@better-fetch/fetch";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up", "/login", "/signup"];

export async function proxy(request: NextRequest) {
    const { data: session } = await betterFetch<{ session: any, user: any }>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

    if (session) {
        const role = session.user.role;

        // If user is logged in and tries to access auth routes, redirect them
        if (isAuthRoute) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.redirect(new URL("/", request.url));
        }

        // If a non-admin tries to access admin routes, redirect to home
        if (isAdminRoute && role !== 'admin') {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // If an admin tries to access non-admin routes, potentially redirect them to /admin 
        // (Uncomment the following lines if you strictly want admins to ONLY see the admin dashboard)
        if (!isAdminRoute && role === 'admin') {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    } else {
        // Not logged in
        if (!isAuthRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except standard Next.js static files and APIs
};
