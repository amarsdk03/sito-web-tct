import Link from "next/link";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {navbarLink} from "@/types/otherTypes";

const navbarLinks: navbarLink[] = [
    {
        title: "Partite",
        href: "/partite",
        imageSrc: "/cards/partite.png",
    },
    {
        title: "Classifiche",
        href: "/classifiche",
        imageSrc: "/cards/classifiche.png",
    },
    {
        title: "Squadre",
        href: "/squadre",
        imageSrc: "/cards/squadre.png",
    },
    {
        title: "Giocatori",
        href: "/giocatori",
        imageSrc: "/cards/giocatori.png",
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
                                loading={"eager"}
                            />
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}