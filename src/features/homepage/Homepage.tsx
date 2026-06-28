"use client";

import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import CarouselSponsor from "@/components/carousel/CarouselSponsor";
import SearchCards from "@/features/homepage/components/SearchCards";
import NextFixturesCarousel from "@/features/homepage/components/NextFixturesCarousel";
import CurrentRankingsTables from "@/features/homepage/components/CurrentRankingsTables";

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
            <Navbar />
            <div className={"page-container"}>
                <div className={"homepage-content"}>
                    <Image
                        src={"/backgrounds/homepage_hero.png"}
                        alt={"Stadio Briamasco"}
                        width={2560}
                        height={1440}
                        className={"w-full lg:px-4 mx-auto mt-4 sm:mt-8 object-cover drop-shadow-2xl"}
                        loading={"eager"}
                        hidden={true}
                    />

                    <motion.div
                        variants={heroContainerAnim}
                        initial="start"
                        whileInView="finish"
                        viewport={{ once: true, amount: 0.2 }}
                        className={"px-4 mt-8 sm:mt-16 text-center max-w-3xl mx-auto"}
                    >
                        <AnimatePresence>
                            <motion.h1 key={1} variants={heroItemAnim} className={"integral-title-hover text-3xl sm:text-6xl font-extrabold text-mist-100"}>
                                Vivi il torneo da protagonista
                            </motion.h1>
                            <motion.p key={2} variants={heroItemAnim} className={"text-mist-300 text-md sm:text-xl mt-6 sm:mt-8"}>
                                Benvenuti sul sito web ufficiale del <b className={"text-lime-300"}>torneo della Città di Trento</b>:
                            </motion.p>
                            <motion.p key={3} variants={heroItemAnim} className={"text-mist-300 text-base sm:text-lg"}>
                                scopri le squadre, esplora le statistiche e segui ogni partita della competizione.
                            </motion.p>
                            <motion.p key={4} variants={heroItemAnim} className={"text-mist-100 text-lg sm:text-2xl font-bold mt-6 sm:mt-8"}>
                                Il torneo più iconico di Trento, ora a portata di click.
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className={"w-full mt-8 sm:mt-16"}>
                    <div className={"text-center font-semibold text-sm uppercase tracking-widest text-mist-500 mb-6"}>
                        Grazie al supporto di
                    </div>
                    <CarouselSponsor />
                </div>

                <div className={"page-content"}>

                    <div className={"mt-12"}>
                        <PageTitle title={"Prossimi incontri"} smallerTitle={true} />
                        <div className={"flex flex-col items-center justify-between mt-6 sm:mt-8"}>
                            <div className={"max-w-4/5 sm:max-w-9/10 lg:max-w-full"}>
                                <NextFixturesCarousel />
                            </div>
                        </div>
                    </div>

                    <div className={"mt-12 sm:mt-16"}>
                        <PageTitle title={"Ultime classifiche"} smallerTitle={true} />
                        <CurrentRankingsTables />
                    </div>

                    <div className={"mt-12 sm:mt-16"}>
                        <PageTitle title={"Esplora"} smallerTitle={true} />
                        <SearchCards />
                    </div>

                    <div className={"mt-12"} hidden={true}>
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
            <Footer />
        </>
    )
}