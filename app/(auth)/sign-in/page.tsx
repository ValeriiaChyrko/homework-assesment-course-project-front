import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "@/app/(auth)/_components/login";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";
import {fetchWithAuth} from "@/lib/fetchWithAuth";

const signingErrors: Record<string | "default", string> = {
    // ...
};

interface SignInPageProp {
    params: Promise<{ [key: string]: string }>;
    searchParams: Promise<{ callbackUrl: string; error: string }>;
}

export default async function Signin({ searchParams }: SignInPageProp) {
    const { callbackUrl, error } = await searchParams;
    const session = await getServerSession(authOptions);

    if (session && session.accessToken) {
        await fetchWithAuth({
            method: "PUT",
            token: session.accessToken,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        });

        redirect(callbackUrl || "/");
    }

    return (
        <div>
            {error && (
                <div>
                    {signingErrors[error.toLowerCase()]}
                </div>
            )}
            <Login />
        </div>
    );
}