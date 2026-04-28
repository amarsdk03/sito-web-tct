'use client'
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import NavbarSheetCard from "@/components/navbar/NavbarSheetCard";

import {navbarLink} from "@/types/otherTypes";
import {RiMenuLine} from "@remixicon/react";

const navbarLinks: navbarLink[] = [
    {
        title: "Home",
        href: "/",
        imageSrc: "/torneo/DSC_2980.JPG",
        imageTraslate: 80,
    },
    {
        title: "Partite",
        href: "/partite",
        imageSrc: "/torneo/DSC_3310.JPG",
        imageTraslate: 90,
    },
    {
        title: "Classifiche",
        href: "/classifiche",
        imageSrc: "/torneo/DSC_3767.JPG",
        imageTraslate: 170,
    },
    {
        title: "Squadre",
        href: "/squadre",
        imageSrc: "/torneo/DSC_2980.JPG",
        imageTraslate: 80,
    },
    {
        title: "Giocatori",
        href: "/giocatori",
        imageSrc: "/torneo/DSC_3310.JPG",
        imageTraslate: 90,
    },
    {
        title: "Altro",
        href: "/menu",
        imageSrc: "/torneo/DSC_3767.JPG",
        imageTraslate: 170,
    }
]

export function NavbarSheet() {

    const pathname = usePathname();
    const shownNavbarLinks = navbarLinks.filter(link => link.href !== pathname);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" size="lg" className="rounded-xl" aria-label={"Menu"}>
                    <RiMenuLine />
                    <span className="hidden sm:block">
                        Menù principale
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side={"left"}
                className="navbar-menu"
            >
                <SheetHeader className={"pb-4"}>
                    <SheetTitle className={"text-2xl font-bold"}>
                        Torneo della Città di Trento
                    </SheetTitle>
                    <SheetDescription className={"text-lg -translate-y-1"}>
                        <b>IV</b> edizione - 2025/2026
                    </SheetDescription>
                </SheetHeader>
                <div className="no-scrollbar overflow-y-auto px-6 pb-4">
                    {
                        shownNavbarLinks.map((link, index) => (
                            <NavbarSheetCard key={index} link={link} />
                        ))
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}
