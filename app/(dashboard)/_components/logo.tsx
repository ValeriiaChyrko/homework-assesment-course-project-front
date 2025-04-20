import Image from "next/image";

export const Logo = () => {
    return (
        <div className="relative w-[130px] h-[70px]">
            <Image
                src="/full-logo-light.svg"
                alt="Logo"
                fill
                priority
                style={{ objectFit: "contain" }}
            />
        </div>
    )
}