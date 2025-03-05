import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Функція перевірки публічних маршрутів
function createRouteMatcher(routes: string[]) {
    return (path: string): boolean => {
        return routes.some((route: string) => {
            const regex = new RegExp(route.replace(/(\/\*|\(.*\))/g, '.*').replace(/\/$/, '') + '$');
            return regex.test(path);
        });
    };
}

// Публічні маршрути, які не потребують авторизації
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/api/uploadthing',
]);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Ігноруємо NextAuth.js маршрути
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // 2. Якщо маршрут публічний — пропускаємо без перевірки
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // 3. Отримуємо токен користувача
    const token = await getToken({ req });

    // 4. Якщо токена немає — редирект на сторінку входу
    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

// 5. Оновлений `matcher`, який не зачіпає `/api/auth/*`
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/auth).*)', // Виключаємо `/api/auth`
        '/(api|trpc)(.*)',
    ],
};