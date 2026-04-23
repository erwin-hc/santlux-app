import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const session = req.nextauth.token;

    if (pathname === "/" && session) {
      return NextResponse.redirect(new URL("/painel", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/") return true;

        return !!token;
      },
    },
    pages: {
      signIn: "/",
    },
  },
);

export const config = {
  matcher: ["/", "/painel/:path*", "/perfil/:path*"],
};
