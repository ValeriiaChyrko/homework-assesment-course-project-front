import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function UserAvatar() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    const fallbackText = session?.user.name?.slice(0, 2).toUpperCase();
    const imageSrc = session?.user.image ?? 'https://github.com/shadcn.png';

    return (
        <div className="flex items-center gap-4">
            <div className="flex justify-center items-center">
                <Avatar>
                    <AvatarImage src={imageSrc} alt={fallbackText} />
                    <AvatarFallback>{fallbackText}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col justify-center cursor-default">
                <p className="m-0 text-sm">{session?.user.name}</p>
                <p className="m-0 text-xs text-slate-700">{session?.user.email}</p>
            </div>
        </div>
    );
}