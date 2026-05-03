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
import ShareProfileDialog from "@/features/giocatori/components/ShareProfileDialog";

import {
    Calendar1,
    FlagIcon,
    FootprintsIcon,
    PencilRulerIcon,
    RulerIcon,
    ShieldUserIcon,
    ShirtIcon,
    WeightIcon
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {RiInstagramLine} from "@remixicon/react";

export default function PlayerInfo() {
    const datiGiocatore = playerInfoSample[0];

    const stemmaSquadra = datiGiocatore.linkStemmaSquadra ?? "/logo_eagle_only.png";
    const coloreSquadra = datiGiocatore.coloreSquadra ?? "#ffffff";

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

                    <div className={"integral-title flex flex-row items-center gap-6 mt-8 sm:mt-6"}>
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className={"player-info-stemma"}
                        >
                            <Link href={`/squadre/dettagli?id=${datiGiocatore.idSquadra}`}>
                                <Image
                                    src={stemmaSquadra}
                                    alt="Stemma squadra"
                                    fill={true}
                                    className={`bg-none rounded-full object-cover`}
                                    draggable={false}
                                    loading={"lazy"}
                                />
                            </Link>
                        </motion.div>
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={"flex flex-col justify-center gap-1 sm:gap-0 -translate-y-1.5 min-w-0"}
                        >
                            <Link href={`/squadre/dettagli?id=${datiGiocatore.idSquadra}`}>
                                <div className={"font-semibold text-sm sm:text-lg lg:text-xl"}>
                                    <span
                                        className={`player-info-title w-full overflow-hidden text-ellipsis`}
                                        style={{color: coloreSquadra}}
                                    >
                                        {datiGiocatore.nomeSquadra}
                                    </span>
                                </div>
                            </Link>
                            <div className={"font-bold text-3xl sm:text-4xl lg:text-6xl -translate-x-1 min-w-0"}>
                                <span className={`player-info-title shine-anim-hover block overflow-hidden text-ellipsis py-0.5 pe-2`}>
                                    {datiGiocatore.nome + " " + datiGiocatore.cognome}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={slideAnim}
                        initial={"start"}
                        animate={"finish"}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className={"flex gap-2 integral-title mt-4"}
                    >
                        {
                            datiGiocatore.usernameIg && (
                                <Link
                                    href={`https://www.instagram.com/${datiGiocatore.usernameIg}`}
                                    target={"_blank"}
                                >
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={"cursor-pointer"}
                                        style={{color: coloreSquadra}}
                                    >
                                        <RiInstagramLine />
                                        <span className={"not-italic -translate-y-0.5"}>
                                            Profilo IG
                                        </span>
                                    </Button>
                                </Link>
                            )
                        }
                        <ShareProfileDialog datiGiocatore={datiGiocatore} coloreSquadra={coloreSquadra} />
                    </motion.div>

                    <Separator className={"my-8 sm:my-10"} />

                    <div className={"w-full"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-8 sm:mb-10"}>
                            Info principali
                        </div>

                        <div className={"grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-y-10"}>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <Calendar1 className={"size-5"} /> Età
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    {
                                        datiGiocatore.dataNascita
                                            ? calcolaEta(datiGiocatore.dataNascita) + " anni"
                                            : "?"
                                    }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <PencilRulerIcon className={"size-5"} /> Ruolo principale
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.ruoloPrincipale || "?" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <ShieldUserIcon className={"size-5"} /> Capitano?
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.isCapitano ? "Sì" : "No" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <ShirtIcon className={"size-5"} /> Numero maglia
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.numeroMaglia || "?" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <FlagIcon className={"size-5"} /> Nazionalità
                                </div>
                                <div className={"flex gap-1.5 items-center text-zinc-100 font-bold text-xl md:text-3xl translate-y-0.25"}>
                                    {
                                        datiGiocatore.nazionalita ? (
                                            <>
                                                <DynamicReactFlag
                                                    countryCode={datiGiocatore.nazionalita}
                                                />
                                                <span className={"sm:-translate-y-0.25"}>
                                                    { datiGiocatore.nazionalita }
                                                </span>
                                            </>
                                        ) : "N/A"
                                    }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <FootprintsIcon className={"size-5"} /> Piede principale
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.piedePreferito || "N/A" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <RulerIcon className={"size-5"} /> Altezza
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.altezza ? datiGiocatore.altezza + " cm" : "N/A" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <WeightIcon className={"size-5"} /> Peso
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiGiocatore.peso ? datiGiocatore.peso + " kg" : "N/A" }
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-10"}>
                            Statistiche all-time
                        </div>

                        <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-8"}>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Partite giocate
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiGiocatore.numeroPartiteGiocate || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Goal segnati
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiGiocatore.numeroGoal || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Assist
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiGiocatore.numeroAssist || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini gialli
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiGiocatore.numeroCartelliniGialli || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini rossi
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiGiocatore.numeroCartelliniRossi || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    MVP totali
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
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