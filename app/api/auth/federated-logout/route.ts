import { JWT, getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

function logoutParams(token: JWT): Record<string, string> {
    return {
        id_token_hint: token.idToken as string,
        post_logout_redirect_uri: process.env.NEXTAUTH_URL || "",
    };
}

function handleEmptyToken() {
    return NextResponse.json({ error: "No session present" }, { status: 400 });
}

function sendEndSessionEndpointToURL(token: JWT) {
    const endSessionEndPoint = new URL(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
    );

    const params: Record<string, string> = logoutParams(token);
    const endSessionParams = new URLSearchParams(params);

    return NextResponse.json({ url: `${endSessionEndPoint.href}?${endSessionParams}` });
}

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (token) {
            return sendEndSessionEndpointToURL(token);
        }

        return handleEmptyToken();
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Unable to logout from the session" },
            { status: 500 }
        );
    }
}