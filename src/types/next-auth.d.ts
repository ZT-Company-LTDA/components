import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends NextAuthOptions {
    // user: {
    //   id: number;
    //   name: string;
    //   email: string;
    //   phone: string | null;
    //   createdAt: string;
    //   deletedAt: string | null;
    //   updatedAt: string;
    //   companyId: number;
    //   company: {
    //     id: number;
    //     name: string;
    //     cnpj: string;
    //     address: string;
    //     createdAt: string;
    //     updatedAt: string;
    //     deletedAt: string | null;
    //   };
    //   token: string;
    //   sub: string;
    //   iat: number;
    //   exp: number;
    //   jti: string;
    // }& DefaultSession["user"]
    user: any
  }
}