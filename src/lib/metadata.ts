import type {Metadata} from "next";

export function dynamicMetadata(title?: string | null, description?: string | null): Metadata {
    return {
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        ),
        title: title ? `Torneo CdT - ${title}` : 'Torneo CdT',
        description: description || "Sito web ufficiale del torneo di calcio della Città di Trento",
        icons: {
            icon: "/logo.png",
            shortcut: "/logo.png",
            apple: "/logo.png",
        },
        manifest: "/manifest.json",
        openGraph: {
            title: title ? `Torneo CdT - ${title}` : 'Torneo CdT',
            description: description || 'Sito ufficiale del torneo',
            url: '/',
            siteName: 'Torneo CdT',
            locale: 'it_IT',
            type: 'website',
            images: ['/logo.png'],
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: 'black-translucent',
            title: 'Torneo CdT',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}