import Image from "next/image";

import NotificationDialog from "@/components/navbar/NotificationDialog";
import {NavbarSheet} from "@/components/navbar/NavbarSheet";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className={"navbar-div w-full sticky top-0 z-50"}>
            <nav className={"navbar flex justify-between items-center px-5 h-18"}>
                <NavbarSheet />
                <div className="flex-1 flex justify-center items-center h-18 relative">
                    <div className="absolute flex items-center">
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
                </div>
                <NotificationDialog />
            </nav>
        </div>
    )
}