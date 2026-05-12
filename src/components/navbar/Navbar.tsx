import Image from "next/image";

import NavbarNewsDialog from "@/components/navbar/NavbarNewsDialog";
import {NavbarMenu} from "@/components/navbar/NavbarMenu";
import Link from "next/link";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

interface NavbarProps {
    noButtons?: boolean
}

export default function Navbar({noButtons = false}: NavbarProps) {
    return (
        <div className={"navbar-div w-full sticky top-0 z-50"}>
            <nav className={"navbar grid grid-cols-5 items-center px-5 h-16"}>
                <div className="flex justify-start items-center gap-2" hidden={noButtons}>
                    <NavbarMenu />
                </div>
                <div className="flex justify-center items-center col-span-3 h-16">
                    <Link href={"/"} className={"navbar-link"}>
                        <Image
                            src={DEFAULT_LOGO_PATH}
                            alt={"Logo torneo"}
                            width={150}
                            height={150}
                            className={"navbar-logo"}
                            draggable={false}
                            loading={"eager"}
                        />
                    </Link>
                </div>
                <div className="flex justify-end items-center gap-2" hidden={noButtons}>
                    <NavbarNewsDialog />
                </div>
            </nav>
        </div>
    )
}