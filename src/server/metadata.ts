import type {Metadata} from "next";

export function dynamicMetadata(
    title?: string | null,
    description?: string | null,
    url?: string | null,
    image?: string | null,
) : Metadata {
    return {
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        ),
        title: title ? `${title} - Torneo Città di Trento` : 'Torneo Città di Trento',
        applicationName: 'Torneo Città di Trento',
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
        alternates: {
            canonical: url || '/',
        },
        openGraph: {
            title: title ? `${title} - Torneo Città di Trento` : 'Torneo Città di Trento',
            description: description || "Sito web ufficiale del torneo di calcio della Città di Trento",
            siteName: 'Torneo Città di Trento',
            url: url || `/`,
            locale: 'it_IT',
            type: 'website',
            images: [
                {
                    url: image ?? '/logo_eagle_only.png',
                    width: 320,
                    height: 320,
                    alt: 'Logo torneo CdT',
                },
            ],
        },
        twitter: {
            card: "summary",
            title: title ? `${title} - Torneo Città di Trento` : 'Torneo Città di Trento',
            description: description || "Sito web ufficiale del torneo di calcio della Città di Trento",
        },
        appleWebApp: {
            capable: true,
            title: 'Torneo Città di Trento',
            statusBarStyle: 'default',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}