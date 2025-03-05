import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "@/app/(auth)/_components/login";

const signingErrors: Record<string | "default", string> = {
// ...
}

interface SignInPageProp {
    params: object
    searchParams: {
        callbackUrl: string
        error: string
    }
}

export default async function Signin({ searchParams }: SignInPageProp) {
    const { callbackUrl, error } = await searchParams;
    const session = await getServerSession(authOptions);

    if (session) {
        redirect(callbackUrl || "/");
    }

    return (
        <div>
            {error && <div>
                {signingErrors[error.toLowerCase()]}
            </div>}
            <Login />
        </div>
    );
}