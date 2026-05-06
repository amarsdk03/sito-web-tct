'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";

import {calcolaEta} from "@/lib/utils";
import {playerInfoSample} from "@/sampleData/players";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import DynamicReactFlag from "@/components/flags/DynamicReactFlag";
import AwardCardInfo from "@/components/awards/AwardCardInfo";

import {
    Calendar1,
    FlagIcon,
    FootprintsIcon,
    PencilRulerIcon,
    RulerIcon,
    WeightIcon
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PlayerSilhouetteImage from "@/features/giocatori/components/PlayerSilhouetteImage";

export default function PlayerInfo() {
    const datiGiocatore = playerInfoSample[0];
    const coloreSquadra = datiGiocatore.coloreSquadra ?? "#dddddd";

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Dettagli giocatore"}
                        smallerTitle={true}
                    />

                    <div className={"sm:flex items-center w-full gap-10 mt-6"}>
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className={"relative bg-zinc-800 min-w-64 mx-0 rounded-md overflow-hidden"}
                        >
                            <div className="integral-title absolute top-0 w-full p-4 z-0">
                                <div className="flex justify-between not-italic text-md tracking-wider">
                                    <div className={"flex flex-col items-start gap-0.5"}>
                                        <span>
                                            {datiGiocatore.nomeMaglia}
                                        </span>
                                        {
                                            datiGiocatore.isCapitano && (
                                                <span className={"text-[0.6em]"}
                                                      style={{color: coloreSquadra}}
                                                >
                                                    Capitano
                                                </span>
                                            )
                                        }
                                    </div>
                                    <span>
                                        {datiGiocatore.numeroMaglia && "#" + datiGiocatore.numeroMaglia}
                                    </span>
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className={"flex justify-center"}
                            >
                                <div className="player-anim-hover max-w-64 pt-5 px-4 translate-y-5">
                                    {/* TODO: gestire immagine del giocatore quando presente */}
                                    <PlayerSilhouetteImage
                                        targetColor={coloreSquadra}
                                        squadLogo={datiGiocatore.linkStemmaSquadra}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={"w-full my-8"}
                        >
                            <div className={"integral-title tracking-wide flex flex-col min-w-0"}>
                                <Link
                                    href={`/squadre/dettagli?id=${datiGiocatore.idSquadra}`}
                                    className={"flex items-center gap-2"}
                                >
                                    <Image
                                        src={datiGiocatore.linkStemmaSquadra || "/logo_eagle_only.png"}
                                        alt="Stemma squadra"
                                        width={30}
                                        height={30}
                                        className={`bg-none rounded-full object-cover`}
                                        draggable={false}
                                        loading={"lazy"}
                                    />
                                    <div className={"font-semibold text-sm sm:text-lg pb-1.5"}>
                                        <span
                                            className={`player-info-title w-full overflow-hidden text-ellipsis`}
                                            style={{color: coloreSquadra}}
                                        >
                                            {datiGiocatore.nomeSquadra}
                                        </span>
                                    </div>
                                </Link>
                                <div className={"font-bold text-3xl sm:text-4xl lg:text-6xl min-w-0"}>
                                    <span className={`player-info-title shine-anim-hover block overflow-hidden text-ellipsis`}>
                                        {datiGiocatore.nome + " " + datiGiocatore.cognome}
                                    </span>
                                </div>
                            </div>

                            <Separator className={"my-6 sm:my-8"} />

                            <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-8"}>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <Calendar1 className={"size-4"} /> Età
                                    </div>
                                    <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                        {
                                            datiGiocatore.dataNascita
                                                ? calcolaEta(datiGiocatore.dataNascita) + " anni"
                                                : "?"
                                        }
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <PencilRulerIcon className={"size-4"} /> Ruolo principale
                                    </div>
                                    <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                        { datiGiocatore.ruoloPrincipale || "?" }
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <FlagIcon className={"size-4"} /> Nazionalità
                                    </div>
                                    <div className={"flex gap-1.5 items-center text-zinc-100 font-bold text-lg md:text-xl"}>
                                        {
                                            datiGiocatore.nazionalita ? (
                                                <>
                                                    <DynamicReactFlag
                                                        countryCode={datiGiocatore.nazionalita}
                                                        size={"6"}
                                                    />
                                                    { datiGiocatore.nazionalita }
                                                </>
                                            ) : "N/A"
                                        }
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <FootprintsIcon className={"size-4"} /> Piede principale
                                    </div>
                                    <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                        { datiGiocatore.piedePreferito || "N/A" }
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <RulerIcon className={"size-4"} /> Altezza
                                    </div>
                                    <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                        { datiGiocatore.altezza ? datiGiocatore.altezza + " cm" : "N/A" }
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 gap-1"}>
                                    <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                        <WeightIcon className={"size-4"} /> Peso
                                    </div>
                                    <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                        { datiGiocatore.peso ? datiGiocatore.peso + " kg" : "N/A" }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <Separator className={"my-8 sm:my-10"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10"}>
                            Statistiche all-time
                        </div>

                        <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-12"}>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Partite giocate
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroPartiteGiocate || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Goal segnati
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroGoal || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Assist
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroAssist || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini gialli
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroCartelliniGialli || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini rossi
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroCartelliniRossi || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    MVP totali
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                    {datiGiocatore.numeroMVP || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-8 sm:mb-10"}>
                            Trofei ottenuti
                        </div>

                        {
                            datiGiocatore.trofeiOttenuti ? (
                                <div className={"grid sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4"}>
                                    {
                                        datiGiocatore.trofeiOttenuti.map((trofeo, index) => (
                                            <AwardCardInfo key={index} awardInfo={trofeo} />
                                        ))
                                    }
                                </div>
                            ) : (
                                <div className={"w-full h-20 flex items-center justify-center"}>
                                    <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                        Nessun trofeo ancora ottenuto dal giocatore
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                            Compagni di squadra
                        </div>
                        <div className={"w-full italic"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Sezione presto in arrivo...
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                            Storico carriera
                        </div>
                        <div className={"w-full italic"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Sezione presto in arrivo...
                            </div>
                        </div>
                    </div>

                    <div className={"w-full mt-20 sm:mt-40"}>
                        <div className={"w-full flex flex-col justify-center items-center text-center"}>
                            <h1 className={"text-2xl font-bold mb-4"}>
                                Informazioni errate o mancanti?
                            </h1>
                            <Link href="/contatti">
                                <Button variant="default" size="lg" className="text-lg font-medium p-5">
                                    Faccelo sapere!
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </>
    )
}