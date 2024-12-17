import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    redirects: async () => [
        {
            source: "/dashboard",
            destination: "/dashboard/overzicht",
            permanent: true,
        },
        {
            source: "/dashboard/afspraken",
            destination: "/dashboard/afspraken/1",
            permanent: true,
        },
        {
            source: "/dashboard/gebruikers",
            destination: "/dashboard/gebruikers/1",
            permanent: true,
        },
    ],
};

export default nextConfig;
