import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@uploadthing/mime-types"],
    images: {
        domains:  [
            "utfs.io"
        ]
    }
};

export default nextConfig;
