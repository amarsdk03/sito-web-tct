'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";

import {teamInfoSample} from "@/sampleData/squadre";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";

import {
    ShieldUserIcon,
    HistoryIcon,
    Tally5Icon,
    CalendarCheckIcon,
    CalendarFoldIcon,
    CalendarMinusIcon,
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {RiInstagramLine} from "@remixicon/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import TeamFormationList from "@/features/squadre/components/TeamFormationList";

export default function TeamInfo() {
    const datiSquadra = teamInfoSample[0];

    const stemmaSquadra = datiSquadra.linkStemma ?? "/logo_eagle_only.png";
    const coloreSquadra = datiSquadra.colore ?? "#ffffff";

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
                        title={"Dettagli squadra"}
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
                            <Image
                                src={stemmaSquadra}
                                alt="Stemma squadra"
                                fill={true}
                                className={`bg-none rounded-full object-cover`}
                                draggable={false}
                                loading={"lazy"}
                            />
                        </motion.div>
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={"flex flex-col justify-center gap-1 sm:gap-0 -translate-y-2 min-w-0"}
                        >
                            <div className={"font-semibold text-sm sm:text-lg lg:text-xl"}>
                                    <span
                                        className={`player-info-title w-full overflow-hidden text-ellipsis`}
                                        style={{color: coloreSquadra}}
                                    >
                                        {datiSquadra.acronimo || "???"}
                                    </span>
                            </div>
                            <div className={"font-bold text-3xl sm:text-4xl lg:text-6xl -translate-x-1 min-w-0"}>
                                <span className={`player-info-title shine-anim-hover block overflow-hidden text-ellipsis pe-2`}>
                                    {datiSquadra.nome}
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
                            datiSquadra.usernameIg && (
                                <Link
                                    href={`https://www.instagram.com/${datiSquadra.usernameIg}`}
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
                    </motion.div>

                    <Separator className={"my-8 sm:my-10"} />

                    <div className={"w-full"}>
                        <div className={"text-3xl md:text-4xl font-extrabold mb-8 sm:mb-10"}>
                            Info principali
                        </div>

                        <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-10"}>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <ShieldUserIcon className={"size-5"} /> Capitano
                                </div>
                                <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    {
                                        datiSquadra.nomeCapitano ? (
                                            <Link href={`/giocatori/dettagli?id=${datiSquadra.idCapitano}`}>
                                                { datiSquadra.nomeCapitano }
                                            </Link>
                                        ) : "?"
                                    }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <HistoryIcon className={"size-5"} /> Iscritti nel
                                </div>
                                <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiSquadra.annoIscrizione?.getFullYear() || "?" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <Tally5Icon className={"size-5"} /> Partite giocate
                                </div>
                                <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiSquadra.numeroPartiteGiocate || "?" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <CalendarCheckIcon className={"size-5"} /> Vittorie
                                </div>
                                <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiSquadra.numeroVittorie || "N/A" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <CalendarFoldIcon className={"size-5"} /> Pareggi
                                </div>
                                <div className={"text-hover-color flex gap-1.5 items-center text-zinc-100 font-bold text-xl md:text-3xl translate-y-0.25"}>
                                    { datiSquadra.numeroPareggi || "N/A" }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1.5"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    <CalendarMinusIcon className={"size-5"} /> Sconfitte
                                </div>
                                <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                    { datiSquadra.numeroSconfitte || "N/A" }
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-10"}>
                            Statistiche all-time
                        </div>

                        <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-8"}>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Goal segnati
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiSquadra.numeroGoalFatti || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Goal subiti
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiSquadra.numeroGoalSubiti || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Differenza reti
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    { (datiSquadra.numeroGoalFatti || 0) - (datiSquadra.numeroGoalSubiti || 0) }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Assist totali
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiSquadra.numeroAssist || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini gialli
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiSquadra.numeroCartelliniGialli || 0}
                                </div>
                            </div>
                            <div className={"grid grid-rows-2"}>
                                <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                    Cartellini rossi
                                </div>
                                <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                    {datiSquadra.numeroCartelliniRossi || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"flex flex-row items-center justify-between gap-2 mb-8"}>
                            <div className={"text-hover-color text-3xl md:text-4xl font-extrabold"}>
                                Rosa della squadra
                            </div>
                            <Select defaultValue={"2025/2026"}>
                                <SelectTrigger className="w-48 rounded-lg">
                                    <SelectValue placeholder="Edizione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className={"bg-background"} defaultValue={"2025/2026"}>
                                        <SelectLabel>Edizione torneo</SelectLabel>
                                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                                        <SelectItem value="2024/2025" disabled>2024/2025 (in arrivo...)</SelectItem>
                                        <SelectItem value="2023/2024" disabled>2023/2024 (in arrivo...)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            datiSquadra.formazioni.length > 0 ? (
                                <TeamFormationList squadColor={coloreSquadra} formation={datiSquadra.formazioni[0].formazione} />
                            ) : (
                                <div className={"w-full"}>
                                    <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                        Nessuna formazione trovata.
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                            Classifiche all-time
                        </div>
                        <div className={"w-full italic"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Sezione presto in arrivo...
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8 sm:my-16"} />

                    <div className={"w-full mt-10"}>
                        <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                            Storico partite
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