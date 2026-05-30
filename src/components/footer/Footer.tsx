import Image from "next/image";
import Link from "next/link";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

export default function Footer() {
    return (
        <div className={"navbar-div w-full z-40 mt-32"}>
            <footer className="w-full pt-6 pb-6 px-4 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-8">

                    <div className="flex flex-col items-center md:items-start max-w-sm">
                        <Link
                            href={"/"}
                            className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
                        >
                            <Image
                                src={DEFAULT_LOGO_PATH}
                                alt={"Logo torneo"}
                                width={100}
                                height={100}
                                draggable={false}
                                className={"navbar-logo -translate-y-1"}
                                loading={"lazy"}
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-mist-100 sm:mt-4 text-center md:text-left tracking-wide">
                            Torneo Città di Trento
                        </h1>
                        <p className="text-mist-300 font-medium text-sm mt-2 text-center md:text-left leading-relaxed">
                            Il torneo più iconico di Trento, ora a portata di click.
                        </p>
                    </div>

                    <div className="flex flex-row flex-wrap justify-center md:justify-end gap-10 sm:gap-16 w-full md:w-auto mt-4 md:mt-0">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-mist-200 mb-1">
                                Principale
                            </h2>
                            <Link href="/" className="text-sm text-mist-200 hover:text-lime-300 transition-colors">
                                Home
                            </Link>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Notizie</span>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Social e contatti</span>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Ultime novità</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-mist-200 mb-1">
                                Cerca
                            </h2>
                            <Link href="/classifiche" className="text-sm text-mist-200 hover:text-lime-300 transition-colors">
                                Classifiche
                            </Link>
                            <Link href="/partite" className="text-sm text-mist-200 hover:text-lime-300 transition-colors">
                                Partite
                            </Link>
                            <Link href="/squadre" className="text-sm text-mist-200 hover:text-lime-300 transition-colors">
                                Squadre
                            </Link>
                            <Link href="/giocatori" className="text-sm text-mist-200 hover:text-lime-300 transition-colors">
                                Giocatori
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-mist-200 mb-1">
                                Altro
                            </h2>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Albo d&#39;oro</span>
                            <span className="text-sm text-mist-400 cursor-not-allowed">FAQ</span>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Staff</span>
                            <span className="text-sm text-mist-400 cursor-not-allowed">Galleria</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-mist-800/40 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <p className="text-sm text-mist-300 text-center sm:text-left">
                        &copy; {new Date().getFullYear()} Torneo Città di Trento.<br className="sm:hidden" /> Tutti i diritti riservati.
                    </p>
                    <p className="text-sm text-mist-300 text-center sm:text-end px-16 sm:px-0">
                        Sito web progettato, sviluppato e mantenuto da
                        <span className="text-white font-medium tracking-wide"> Amar Sidkir</span> e
                        <span className="text-white font-medium tracking-wide"> Alessandro Gremes</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}