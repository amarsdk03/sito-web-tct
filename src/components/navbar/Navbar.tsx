import Image from "next/image";

import NavbarNewsDialog from "@/components/navbar/NavbarNewsDialog";
import {NavbarMenu} from "@/components/menu/NavbarMenu";
import Link from "next/link";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

interface NavbarProps {
    noButtons?: boolean
}

export default function Navbar({noButtons = false}: NavbarProps) {
    const tempHidden = true;

    return (
        <div className={"navbar-div w-full sticky top-0 z-50"}>
            <nav className={`navbar grid grid-cols-${tempHidden ? 3 : 5} items-center px-1.5 sm:px-2 h-12`}>
                <div className="flex justify-start items-center gap-2" hidden={noButtons || tempHidden}>
                    <NavbarMenu />
                </div>
                <div className={`flex justify-center items-center col-span-3 h-12`}>
                    <Link href={"/"} className={"navbar-link"}>
                        <Image
                            src={DEFAULT_LOGO_PATH}
                            alt={"Logo torneo"}
                            width={120}
                            height={120}
                            className={"navbar-logo"}
                            draggable={false}
                            loading={"eager"}
                        />
                    </Link>
                </div>
                <div className="flex justify-end items-center gap-2" hidden={noButtons || tempHidden}>
                    <NavbarNewsDialog />
                </div>
            </nav>
        </div>
    )
}