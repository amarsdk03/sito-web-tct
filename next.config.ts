import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.1.74'],
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
