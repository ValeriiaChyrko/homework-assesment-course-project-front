import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

function createRouteMatcher(routes: string[]) {
    return (path: string): boolean => {
        return routes.some((route: string) => {
            const regex = new RegExp(route.replace(/(\/\*|\(.*\))/g, '.*').replace(/\/$/, '') + '$');
            return regex.test(path);
        });
    };
}

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/api/uploadthing',
]);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/api/uploadthing")) {
        return NextResponse.next();
    }

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const token = await getToken({ req });

    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
        '/(api|trpc)(.*)',
    ],
};