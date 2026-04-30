import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className={"navbar-div w-full z-50 mt-24"}>
            <nav className={"items-center px-5 h-56"}>
                <div className="flex justify-center items-center h-56">
                    <Link href={"/"} className={"navbar-link"}>
                        <Image
                            src="/logo_eagle_only.png"
                            alt="Logo torneo"
                            width={200}
                            height={200}
                            draggable={false}
                            loading={"eager"}
                        />
                    </Link>
                </div>
            </nav>
        </div>
    )
}