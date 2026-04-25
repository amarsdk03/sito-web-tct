'use client'
import {navbarLink} from "@/types/otherTypes";

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
    return (
        <div className="flex flex-wrap gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="secondary" className="rounded-lg" size="icon-lg" aria-label={"Menu"}>
                        <RiMenuLine />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side={"left"}
                    className="navbar-menu"
                >
                    <SheetHeader>
                        <SheetTitle>
                            Torneo Città di Trento
                        </SheetTitle>
                    </SheetHeader>
                    <div className="no-scrollbar overflow-y-auto px-6">
                        {
                            navbarLinks.map((link, index) => (
                                <NavbarSheetCard key={index} link={link} />
                            ))
                        }
                    </div>
                    <SheetFooter>
                        <SheetDescription>
                            IV Edizione - 2025/2026
                        </SheetDescription>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
