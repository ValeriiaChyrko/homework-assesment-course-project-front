"use client"
import federatedLogout from "@/utils/federatedLogout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Logout() {
    return(
        <Button
            size="sm"
            variant="ghost"
            onClick={() => federatedLogout()}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Вийти
        </Button>
    );
}