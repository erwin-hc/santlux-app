import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
      isAdmin?: boolean | false;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string | null;
  }
}
