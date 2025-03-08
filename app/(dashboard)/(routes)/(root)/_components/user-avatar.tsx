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
        <Avatar>
            <AvatarImage src={imageSrc} alt={userInfo?.login} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
        </Avatar>
    );
}