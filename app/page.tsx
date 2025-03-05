"use client";  // У клієнтських компонентах

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";  // Імпортуємо бібліотеку для декодування

// Оголошуємо інтерфейс для структури даних userInfo
interface UserInfo {
    GithubUserName?: string;
    GithubProfileUrl?: string;
    GithubPictureUrl?: string;
}

// Оголошуємо тип для декодованих даних
interface AccessTokenData {
    login: string;
    html_url: string;
    avatar_url: string;
}

export default function Profile() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (!session?.accessToken) return;

        try {
            // Декодуємо токен
            const decodedToken: AccessTokenData = jwtDecode(session.accessToken);

            // Встановлюємо дані в стан
            setUserInfo({
                GithubUserName: decodedToken.login,
                GithubProfileUrl: decodedToken.html_url,
                GithubPictureUrl: decodedToken.avatar_url
            });
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }, [session]);

    return (
        <div>
            <div>Your name is {session?.user?.name}</div>
            <div>Your email is {session?.user?.email}</div>
            <div>Your GitHub login: {userInfo?.GithubUserName || "Loading..."}</div>
            <div>Your GitHub profile: {userInfo?.GithubProfileUrl}</div>
            <div>
                Your GitHub avatar:{" "}
                {userInfo?.GithubPictureUrl && <img src={userInfo.GithubPictureUrl} alt="Avatar" />}
            </div>
        </div>
    );
}