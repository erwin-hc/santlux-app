import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
      isAdmin?: boolean | false;
      tokenExpired?: boolean; // ← fica dentro de user
      accessToken: string;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string | null;
    isAdmin?: boolean;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string | null;
    isAdmin?: boolean;
    expiresAt?: number;
    tokenExpired?: boolean;
  }
}
