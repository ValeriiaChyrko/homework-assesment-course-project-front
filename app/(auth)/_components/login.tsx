"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();

    useEffect(() => {
        const signInUser  = async () => {
            const result = await signIn("keycloak", { redirect: false });
            if (result?.error) {
                console.error("Sign-in error:", result.error);
            } else {
                await router.push('/');
            }
        };

        signInUser ().then();
    }, [router]);

    return <p>Redirecting to login...</p>;
}