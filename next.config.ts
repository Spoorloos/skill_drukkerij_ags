import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    redirects: async () => [
        {
            source: "/dashboard",
            destination: "/dashboard/afspraken",
            permanent: true,
        },
    ],
};

export default nextConfig;
