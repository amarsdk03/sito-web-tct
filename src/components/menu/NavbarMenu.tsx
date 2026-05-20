'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { RiMenuLine } from "@remixicon/react";
import { DEFAULT_NOME_ULTIMA_EDIZIONE } from "@/const/defaultConstants";

export function NavbarMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" className="rounded-md" aria-label={"Menu"}>
                    <RiMenuLine />
                    <span className="hidden sm:block">
                        Menù principale
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side={"left"}
                className="navbar-menu flex flex-col h-full bg-zinc-950 border-r border-mist-800/60"
            >
                <SheetHeader className={"pb-6 border-b border-mist-800/40 text-left"}>
                    <SheetTitle className={"text-xl font-bold text-mist-100"}>
                        Torneo Città di Trento
                    </SheetTitle>
                    <SheetDescription className={"text-sm text-mist-400 -translate-y-0.5"}>
                        {DEFAULT_NOME_ULTIMA_EDIZIONE}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10">

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                            Principale
                        </h3>
                        <div className="flex flex-col gap-4">
                            <SheetClose asChild>
                                <Link href="/" className="integral-title navbar-menu-link text-base font-medium text-mist-200">
                                    Home
                                </Link>
                            </SheetClose>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Notizie</span>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Social e contatti</span>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Ultime novità</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                            Ricerca
                        </h3>
                        <div className="flex flex-col gap-4">
                            <SheetClose asChild>
                                <Link href="/classifiche" className="integral-title navbar-menu-link text-base font-medium text-mist-200">
                                    Classifiche
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/partite" className="integral-title navbar-menu-link text-base font-medium text-mist-200">
                                    Partite
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/squadre" className="integral-title navbar-menu-link text-base font-medium text-mist-200">
                                    Squadre
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/giocatori" className="integral-title navbar-menu-link text-base font-medium text-mist-200">
                                    Giocatori
                                </Link>
                            </SheetClose>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">
                            Altro
                        </h3>
                        <div className="flex flex-col gap-4">
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Albo d&#39;oro</span>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">FAQ</span>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Staff</span>
                            <span className="integral-title navbar-menu-link text-base font-medium text-mist-400/50 cursor-not-allowed">Galleria</span>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    )
}