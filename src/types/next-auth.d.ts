import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: USER | ADMIN | null;
      institutionalEmail: string | null | undefined;
      emVerified: boolean | null | undefined;
    } & DefaultSession["user"];
  }
}
