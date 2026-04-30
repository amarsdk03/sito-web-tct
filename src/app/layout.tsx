import {ReactNode} from "react";
import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Figtree, Roboto } from "next/font/google";

import { Toaster } from "sonner";
import {ThemeWrapper} from "@/components/theme/theme-wrapper";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});
const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: "Torneo Città di Trento",
    description: "Sito web ufficiale del torneo di calcio della Città di Trento",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html
            lang="it"
            className={cn("font-sans", figtree.variable, robotoHeading.variable)}
            suppressHydrationWarning
        >
            <body suppressHydrationWarning>
                <ThemeWrapper>
                    {children}
                </ThemeWrapper>
                <Toaster position="bottom-right" richColors />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
