import Image from "next/image";

import NotificationDialog from "@/components/navbar/NotificationDialog";
import {NavbarSheet} from "@/components/navbar/NavbarSheet";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className={"navbar-div w-full sticky top-0 z-50"}>
            <nav className={"navbar grid grid-cols-5 items-center px-5 h-18"}>
                <div className="flex justify-start items-center gap-2">
                    <NavbarSheet/>
                </div>
                <div className="flex justify-center items-center col-span-3 h-18">
                    <Link href={"/"} className={"navbar-link"}>
                        <Image
                            src="/logo_eagle_only.png"
                            alt="Logo torneo"
                            width={175}
                            height={175}
                            className={"navbar-logo"}
                            draggable={false}
                        />
                    </Link>
                </div>
                <div className="flex justify-end items-center gap-2">
                    <NotificationDialog />
                </div>
            </nav>
        </div>
    )
}