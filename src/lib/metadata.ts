import type {Metadata} from "next";

export function dynamicMetadata(title?: string | null, description?: string | null): Metadata {
    return {
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        ),
        title: title ? `Torneo CdT - ${title}` : 'Torneo CdT',
        description: description || "Sito web ufficiale del torneo di calcio della Città di Trento",
        icons: [
            {
                url: "/logo_eagle_only.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                url: "/logo_eagle_only.png",
                sizes: "320x320",
                type: "image/png"
            }
        ],
        manifest: "/manifest.json",
        openGraph: {
            title: title ? `Torneo CdT - ${title}` : 'Torneo CdT',
            description: description || 'Sito ufficiale del torneo',
            url: '/',
            siteName: 'Torneo CdT',
            locale: 'it_IT',
            type: 'website',
            images: ['/logo_eagle_only.png'],
        },
        appleWebApp: {
            capable: true,
            title: 'Torneo CdT',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}