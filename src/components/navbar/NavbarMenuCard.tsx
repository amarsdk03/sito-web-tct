import Image from "next/image"

import {Card} from "@/components/ui/card"
import {navbarLink} from "@/types/otherTypes";
import Link from "next/link";

export default function NavbarMenuCard({link, globalTranslate}: { link: navbarLink, globalTranslate?: number }) {
    return (
        <Link href={link.href}>
            <Card className="navbar-card relative mx-auto w-full h-32 pt-0 mb-4">
                <div className="navbar-card-title absolute bottom-0 left-0 z-30 p-4">
                    {link.title}
                </div>
                    <Image
                        src={link.imageSrc}
                        alt="Card image cover"
                        width={500}
                        height={500}
                        className={`navbar-card-img relative z-20 object-cover`}
                        style={{transform: `translateY(-${link.imageTraslate + (globalTranslate ?? 0)}px)`}}
                        loading={"lazy"}
                    />
            </Card>
        </Link>
    )
}