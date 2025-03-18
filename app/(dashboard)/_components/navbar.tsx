import {MobileSidebar} from "./mobile-sidebar";
import {NavbarRoutes} from "@/components/navbar-routes";

export const Navbar = () => {
    return (
        <div className="p-4 border-b border-gray-900/25 h-full flex items-center bg-white shadow-sm">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}