// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Se o usuário tentar acessar /login e já estiver logado, manda para o dashboard
    if (req.nextUrl.pathname === "/" && !!req.nextauth.token) {
      return NextResponse.redirect(new URL("/painel", req.url));
    }
  },
  {
    callbacks: {
      // O middleware só prossegue se a função authorized retornar true
      authorized: ({ token }) => !!token,
    },
  },
);

// Aqui você define quais rotas devem ser protegidas
export const config = {
  matcher: [
    "/painel/:path*", // Protege /dashboard e qualquer sub-rota
    "/perfil/:path*", // Protege /perfil
    // Adicione outras rotas privadas aqui
  ],
};
