import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string | undefined;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        userAttributes?: Record<string, string | number | boolean>;
    }
}

declare module "next-auth" {
    interface Session {
        error?: string;
    }
}