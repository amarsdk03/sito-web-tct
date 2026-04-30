'use client'
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import NavbarMenuCard from "@/components/navbar/NavbarMenuCard";
import {RiMenuLine} from "@remixicon/react";
import {navbarLinks} from "@/const/page-cards";

export function NavbarMenu() {

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
                            <NavbarMenuCard key={index} link={link} />
                        ))
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}
