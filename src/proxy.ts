import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

export default function proxy(request: NextRequest) {
    if (MAINTENANCE_MODE) {
        return NextResponse.rewrite(new URL('/in_manutenzione', request.url));
    } else if (request.nextUrl.pathname === '/in_manutenzione') {
        return NextResponse.rewrite(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static).*)',
    ],
};