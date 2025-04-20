import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            login?: string;
        };
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        avatar_url?: string;
        login?: string;
    }
}

declare module "next-auth" {
    interface Session {
        error?: string;
    }
}