"use client";

import Image from "next/image";
import { Trophy, CalendarDays, LineChart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import CarouselSponsor from "@/components/carousel/CarouselSponsor";
import SearchCards from "@/features/homepage/components/SearchCards";

// 1. Definiamo le varianti QUI (con il tipo corretto)

export default function Homepage() {
    const heroContainerAnim = {
        start: { opacity: 0 },
        finish: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const heroItemAnim = {
        start: { opacity: 0, y: 20 },
        finish: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
    };

    return (
        <>
            <main className={"flex-1"}>
                <Navbar />
                <div className={"page-container"}>
                    <div className={"homepage-content"}>
                        <Image
                            src={"/backgrounds/homepage_hero.png"}
                            alt={"Stadio Briamasco"}
                            width={2560}
                            height={1440}
                            className={"w-full lg:rounded-sm lg:px-4 mx-auto mt-4 sm:mt-8 object-cover"}
                            loading={"eager"}
                        />

                        <motion.div
                            variants={heroContainerAnim}
                            initial="start"
                            whileInView="finish"
                            viewport={{ once: true, amount: 0.2 }}
                            className={"px-6 mt-8 sm:mt-16 text-center max-w-3xl mx-auto"}
                        >
                            <AnimatePresence>
                                <motion.h1 key={1} variants={heroItemAnim} className={"integral-title text-3xl sm:text-6xl font-extrabold text-mist-100"}>
                                    Vivi il torneo da protagonista
                                </motion.h1>
                                <motion.p key={2} variants={heroItemAnim} className={"text-mist-400 text-base sm:text-xl mt-6 sm:mt-8"}>
                                    Benvenuti sul sito web ufficiale del <b>torneo della Città di Trento</b>:
                                </motion.p>
                                <motion.p key={3} variants={heroItemAnim} className={"text-mist-400 text-base sm:text-lg"}>
                                    scopri le squadre, esplora le statistiche e segui ogni partita della competizione.
                                </motion.p>
                                <motion.p key={4} variants={heroItemAnim} className={"text-mist-100 text-lg sm:text-2xl font-bold mt-6 sm:mt-8"}>
                                    Il torneo più iconico di Trento, ora a portata di click.
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className={"w-full mt-8 sm:mt-12"}>
                        <div className={"text-center font-semibold text-sm uppercase tracking-widest text-mist-500 mb-6 sm:mb-8"}>
                            Grazie al supporto di
                        </div>
                        <CarouselSponsor />
                    </div>

                    <div className={"homepage-content"}>
                        <div className={"px-4 mt-12 sm:mt-20"}>
                            <PageTitle title={"Esplora"} smallerTitle={true} />
                            <SearchCards />
                        </div>

                        <div className={"px-8 mt-12 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4"}>
                            <div className={"bg-mist-800/30 border border-mist-800/60 p-6 rounded-xl flex flex-col items-center text-center"}>
                                <div className={"p-3 bg-emerald-500/20 text-emerald-400 rounded-full mb-4"}>
                                    <Trophy size={28} />
                                </div>
                                <h3 className={"text-xl font-bold text-mist-200 mb-2"}>Classifiche</h3>
                                <p className={"text-sm text-mist-400"}>Risultati aggiornati e classifiche in tempo reale per ogni categoria e girone.</p>
                            </div>

                            <div className={"bg-mist-800/30 border border-mist-800/60 p-6 rounded-xl flex flex-col items-center text-center"}>
                                <div className={"p-3 bg-sky-500/20 text-sky-400 rounded-full mb-4"}>
                                    <CalendarDays size={28} />
                                </div>
                                <h3 className={"text-xl font-bold text-mist-200 mb-2"}>Calendario</h3>
                                <p className={"text-sm text-mist-400"}>Non perderti neanche una partita. Consulta date, orari e campi di gioco.</p>
                            </div>

                            <div className={"bg-mist-800/30 border border-mist-800/60 p-6 rounded-xl flex flex-col items-center text-center"}>
                                <div className={"p-3 bg-amber-500/20 text-amber-400 rounded-full mb-4"}>
                                    <LineChart size={28} />
                                </div>
                                <h3 className={"text-xl font-bold text-mist-200 mb-2"}>Statistiche</h3>
                                <p className={"text-sm text-mist-400"}>Analizza le performance delle squadre: gol, differenza reti e andamento storico.</p>
                            </div>
                        </div>

                        <div className={"px-8 mt-12"}>
                            <div className={"bg-zinc-900/50 border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"}>
                                <div className={"absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-amber-500/5 blur-3xl rounded-full pointer-events-none"} />

                                <div className={"relative z-10"}>
                                    <div className={"text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2"}>
                                        Lavori in corso
                                    </div>
                                    <h2 className={"font-bold text-2xl sm:text-3xl text-mist-100 mb-3"}>
                                        Sito web ancora in sviluppo
                                    </h2>
                                    <p className={"text-mist-400 text-sm sm:text-base max-w-lg mx-auto mb-6"}>
                                        Stiamo preparando tutto per offrirti la migliore esperienza possibile. Molte nuove funzionalità saranno disponibili a breve.
                                    </p>
                                    <div className={"inline-flex items-center justify-center px-6 py-2.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-medium text-sm"}>
                                        Coming estate 2026...
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}