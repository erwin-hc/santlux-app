/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = ({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

        if (!backendUrl) {
          console.error("ERRO: Variável NEXT_PUBLIC_URLBACKEND não encontrada no .env.local");
          return null;
        }

        const formData = new URLSearchParams();
        formData.append("username", credentials?.email || "");
        formData.append("password", credentials?.password || "");

        try {
          const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          });

          const data = await res.json();

          if (res.ok && data.access_token) {
            return {
              id: data.user.email,
              email: data.user.email,
              username: data.user.username,
              isAdmin: data.user.isAdmin,
              accessToken: data.access_token,
            };
          }

          console.error("Falha no login:", data.detail || "Credenciais inválidas");
          return null;
        } catch (error) {
          console.error("Erro ao conectar no servidor:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.username = (user as any).username;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).username = token.username;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});