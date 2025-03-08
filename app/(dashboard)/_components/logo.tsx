import Image from "next/image";

export const Logo = () => {
    return (
        <Image
            src="/full-logo.svg"
            alt="Logo"
            height={70}
            width={130}
            priority
        />
    )
}