import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['10.196.168.7'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ltoyerplsuddusqgzxvw.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.instagram.com',
            },
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
            },
        ],
    },
};

export default nextConfig;
