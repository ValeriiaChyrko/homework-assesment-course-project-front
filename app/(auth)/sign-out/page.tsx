
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Logout from "@/app/(auth)/_components/logout";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export default async function SignoutPage() {
    const session = await getServerSession(authOptions);
    if (session) {
        return (
            <div>
                <div>
                    <Logout />
                </div>
            </div>
        )
    }
    return redirect("/api/auth/signin")
}