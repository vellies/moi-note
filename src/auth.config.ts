import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string })?.role === 'admin';
      const { pathname } = nextUrl;

      if (pathname.startsWith('/admin') && !isAdmin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      if (!isLoggedIn && pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
};
