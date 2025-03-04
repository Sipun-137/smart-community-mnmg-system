/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/auth/login' || path === '/'

    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }

}

export const config = {
    matcher: ['/', '/auth/login', "/dashboard/:path"]
};

