'use client';

import Image from "next/image";
import {motion} from "framer-motion";

import {samplePartite} from "@/sampleData/partite";
import {teamInfoSample} from "@/sampleData/squadre";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";

import {RiCheckboxBlankCircleFill} from "@remixicon/react";
import Link from "next/link";

export default function FixtureInfo() {
    const datiPartita = samplePartite[2];
    const inCorso = true;

    const aiCalciDiRigore = datiPartita.esito.rigoriCasa && datiPartita.esito.rigoriOspiti;
    const esitoRigori = (datiPartita.esito.rigoriCasa?.toString() || "?") + " - " + (datiPartita.esito.rigoriOspiti?.toString() || "?");

    const formazioneSquadraCasa = teamInfoSample[0].formazioni[0].formazione;
    const formazioneSquadraOspite = teamInfoSample[0].formazioni[1].formazione;

    const formazioniSquadre = Array.from({length: Math.max(formazioneSquadraCasa.length, formazioneSquadraOspite.length)}, (_, index) => [
        formazioneSquadraCasa[index] ?? "",
        formazioneSquadraOspite[index] ?? ""
    ]).flat();
    
    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Dettagli partita"}
                        smallerTitle={true}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0, }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={"flex flex-col flex-wrap items-center mt-6 sm:mt-10 mb-6 sm:mb-0"}
                    >
                        {
                            inCorso && (
                                <Badge variant="destructive" className={"font-bold text-sm sm:text-md py-2.5 ms-2"}>
                                    <RiCheckboxBlankCircleFill className={"live-circle"} />
                                    In corso
                                </Badge>
                            )
                        }
                        <div className={"w-full sm:w-1/2 integral-title-hover font-bold text-center flex text-7xl mb-2 sm:mb-2"}>
                            <span className={"flex-1"}>
                                {datiPartita.esito.goalCasa ?? "?"}
                            </span>
                            <span className={"flex-shrink-0 px-4 -translate-x-0.5"}>
                                {" - "}
                            </span>
                            <span className={"flex-1"}>
                                {datiPartita.esito.goalOspiti ?? "?"}
                            </span>
                        </div>
                        {
                            datiPartita.esito.vittoriaTavolino ? (
                                <div className={"integral-title font-semibold tracking-wider text-md sm:text-xl text-center text-mist-400 mt-1 mb-4 sm:mb-2"}>
                                    {"Vittoria a tavolino"}
                                </div>
                            ) : aiCalciDiRigore && (
                                <div className={"integral-title font-semibold tracking-widest text-2xl text-center text-mist-400 mb-4 sm:mb-2"}>
                                    {esitoRigori + " D.C.R."}
                                </div>
                            )
                        }
                    </motion.div>

                    <div className={"grid grid-cols-5 items-center gap-6 w-full mt-4 sm:mt-8"}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={"text-hover-color col-span-2 text-start text-lg sm:text-2xl md:text-4xl text-mist-200 font-extrabold overflow-hidden text-ellipsis"}
                        >
                            <Link
                                href={"/squadre/dettagli?id=" + datiPartita.squadraCasa.id}
                            >
                                {datiPartita.squadraCasa.nome ?? "???"}
                            </Link>
                        </motion.div>

                        <span className={"match-result text-center text-lg sm:text-2xl text-chart-1 font-bold -translate-y-0.5"}>
                            {" vs "}
                        </span>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={"text-hover-color col-span-2 text-end text-lg sm:text-2xl md:text-4xl text-mist-200 font-extrabold overflow-hidden text-ellipsis"}
                        >
                            <Link
                                href={"/squadre/dettagli?id=" + datiPartita.squadraOspiti.id}
                            >
                                {datiPartita.squadraOspiti.nome ?? "???"}
                            </Link>
                        </motion.div>
                    </div>

                    <div className={"grid grid-cols-2 gap-4 mt-4 sm:mt-4 w-full"}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                            className={"text-xs sm:text-base text-mist-400 font-bold"}
                        >
                            <div className={"flex items-center justify-start"}>
                                <div className={"flex items-center justify-start gap-0.25"}>
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                </div>
                                <span className={"ms-2 truncate text-ellipsis"}>
                                    {"Del Dot Simone"}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                            className={"text-xs sm:text-base text-mist-400 font-bold"}
                        >
                            <div className={"flex items-center justify-end"}>
                                <span className={"me-2 truncate text-ellipsis"}>
                                    {"Nicolò Fennato"}
                                </span>
                                <div className={"flex items-center justify-end gap-0.25"}>
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <Separator className={"mt-8 sm:mt-12 mb-8"} />

                    <div className={"space-y-6 w-full"}>
                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Edizione torneo
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {"2024/2025"}
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Categoria
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {"Amatori"}
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Fase
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {datiPartita.girone + " (giornata " + datiPartita.giornata + ")"}
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Data e ora partita
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {datiPartita.fischioInizio.toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                                {" - "}
                                {datiPartita.fischioInizio.toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8"} />

                    <div>
                        <h4 className={"text-hover-color text-center text-2xl md:text-3xl text-mist-200 font-extrabold overflow-hidden text-ellipsis my-10 sm:my-16"}>
                            Formazioni squadre
                        </h4>

                        <div className={"grid grid-cols-2 gap-4 sm:gap-6 text-mist-100 text-base md:text-xl"}>
                            {
                                formazioniSquadre.map((giocatore, index) =>
                                    giocatore ? (
                                        <Link
                                            key={index}
                                            href={"/giocatori/dettagli?id=" + giocatore.id}
                                            className={"text-hover-color font-semibold " + (index % 2 ? "text-end" : "text-start")}
                                        >
                                            {
                                                (giocatore.isCapitano === true && index % 2 !== 0) && (
                                                    <Badge className={"me-2 pt-3 pb-2.5 -translate-y-0.5"}>
                                                        <b>Capitano</b>
                                                    </Badge>
                                                )
                                            }
                                            { giocatore.nome + " " + giocatore.cognome }
                                            {
                                                (giocatore.isCapitano === true && index % 2 === 0) && (
                                                    <Badge className={"ms-2 pt-3 pb-2.5 -translate-y-0.5"}>
                                                        <b>Capitano</b>
                                                    </Badge>
                                                )
                                            }
                                        </Link>
                                    ) : <div key={index}></div>
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </>
    )
}