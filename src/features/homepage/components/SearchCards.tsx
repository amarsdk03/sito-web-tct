import Link from "next/link";
import {Card} from "@/components/ui/card";
import Image from "next/image";

export interface navbarLink {
    title: string,
    href: string,
    imageSrc: string,
    imageTranslate?: number,
}

const navbarLinks: navbarLink[] = [
    {
        title: "Partite",
        href: "/partite",
        imageSrc: "/cards/partite.png",
        imageTranslate: 50,
    },
    {
        title: "Classifiche",
        href: "/classifiche",
        imageSrc: "/cards/classifiche.png",
        imageTranslate: 30,
    },
    {
        title: "Squadre",
        href: "/squadre",
        imageSrc: "/cards/squadre.png",
        imageTranslate: 15,
    },
    {
        title: "Giocatori",
        href: "/giocatori",
        imageSrc: "/cards/giocatori.png",
        imageTranslate: 30,
    },
]

export default function SearchCards() {
    return (
        <div className="grid sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
            {
                navbarLinks.map((link, index) => (
                    <Link key={index} href={link.href}>
                        <Card className="navbar-card relative mx-auto w-full h-32 pt-0">
                            <div className="navbar-card-title text-3xl absolute bottom-0 left-0 z-30 p-4">
                                {link.title}
                            </div>
                            <Image
                                src={link.imageSrc}
                                alt={link.title}
                                width={500}
                                height={500}
                                className={`navbar-card-img relative z-20 object-cover`}
                                style={{transform: `translateY(-${link.imageTranslate  ?? 0}px)`}}
                                loading={"eager"}
                            />
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}