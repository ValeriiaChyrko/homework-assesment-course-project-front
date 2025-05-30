﻿import { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

interface AccessTokenData {
    github_login: string;
    avatar_url: string;
}

async function requestRefreshOfAccessToken(token: JWT) {
    if (!token.refreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
        }),
        method: "POST",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return response.json();
}

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    session: {
        maxAge: 60 * 30,
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;

                const decodedToken: AccessTokenData = jwtDecode(account.access_token!);
                token.avatar_url = decodedToken.avatar_url;
                token.github_login = decodedToken.github_login;

                return token;
            }

            if (token.expiresAt && Date.now() >= token.expiresAt * 1000 - 60 * 1000) {
                try {
                    const tokens = await requestRefreshOfAccessToken(token);

                    return {
                        ...token,
                        idToken: tokens.id_token,
                        accessToken: tokens.access_token,
                        expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    };
                } catch (error) {
                    console.error("Error refreshing access token:", error);
                    return { ...token, error: "RefreshAccessTokenError" };
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.image = token.avatar_url;
                session.user.github_login = token.github_login;
            }
            session.accessToken = token.accessToken;
            return session;
        }
    },
};