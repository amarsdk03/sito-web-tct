import Image from "next/image";
import Link from "next/link";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

export default function Footer() {
    return (
        <div className={"navbar-div w-full z-50 mt-32"}>
            <footer className="w-full border-t border-white/10 p-4 mt-auto">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-48">
                    <div className="flex flex-col items-center">
                        <Link
                            href={"/"}
                            className="flex items-center justify-center"
                        >
                            <Image
                                src={DEFAULT_LOGO_PATH}
                                alt={"Logo torneo"}
                                width={120}
                                height={120}
                                draggable={false}
                                loading={"eager"}
                            />
                        </Link>

                        <h1 className="text-xl font-bold text-center md:text-left">
                            Torneo Città di Trento
                        </h1>
                    </div>

                    <div className="flex flex-row justify-around items-center gap-10 md:mt-6">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold">
                                Principale
                            </h2>

                            <Link href="/" className="text-sm">
                                Home
                            </Link>

                            <Link href="/partite" className="text-sm">
                                Partite
                            </Link>

                            <Link href="#" className="text-sm">
                                Classifica
                            </Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold">
                                Cerca
                            </h2>

                            <Link href="/squadre" className="text-sm">
                                Squadre
                            </Link>

                            <Link href="/giocatori" className="text-sm">
                                Giocatori
                            </Link>

                            <Link href="#" className="text-sm">
                                Campi
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-10 mb-4">
                    <p className="text-xs text-gray-200 text-center">
                        Sito web progettato, sviluppato e mantenuto da <b>Amar Sidkir</b>
                    </p>
                </div>
            </footer>
        </div>
    );
}