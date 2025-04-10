import { useEffect, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

interface AccessTokenData {
    login: string;
    avatar_url: string;
    name: string;
    email: string;
}

export function UserAvatar() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<AccessTokenData | null>(null);

    useEffect(() => {
        if (!session?.accessToken) return;

        try {
            const decodedToken: AccessTokenData = jwtDecode(session.accessToken);

            setUserInfo({
                login: decodedToken.login,
                avatar_url: decodedToken.avatar_url,
                name: decodedToken.name,
                email: decodedToken.email
            });
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }, [session]);

    const fallbackText = userInfo?.login?.slice(0, 2).toUpperCase();
    const imageSrc = userInfo?.avatar_url ?? 'https://github.com/shadcn.png';

    if (!userInfo) {
        return <div />;
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex justify-center items-center">
                <Avatar>
                    <AvatarImage src={imageSrc} alt={userInfo?.login} />
                    <AvatarFallback>{fallbackText}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col justify-center cursor-default">
                <p className="m-0 text-sm">{userInfo?.name}</p>
                <p className="m-0 text-xs text-slate-700">{userInfo?.email}</p>
            </div>
        </div>
    );
}