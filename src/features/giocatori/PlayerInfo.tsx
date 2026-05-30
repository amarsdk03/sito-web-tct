'use client';

import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";

import {calcolaEta, calcolaRapportoContrasto} from "@/lib/utils";
import {datiGiocatoreType, statisticheGiocatoreType} from "@/server/data/players";
import {datiSquadraType, formazioneSquadraType,} from "@/server/data/teams";
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_COLORE_SQUADRA_CASA,
    DEFAULT_CONTRAST_RATIO,
    DEFAULT_FALLBACK_COLOR,
    DEFAULT_LOGO_PATH
} from "@/const/defaultConstants";

import DynamicReactFlag from "@/components/country-flags/DynamicReactFlag";
import ShareProfileDialog from "@/features/giocatori/components/ShareProfileDialog";
import FormationFilters from "@/components/formation/FormationFilters";

import {generatePlayerSilhouette} from "@/lib/formationRendering";
import {PlayerSilhouette} from "@/features/giocatori/components/PlayerSilhouette";
import {FormationList} from "@/components/formation/FormationList";

import {Calendar1, FlagIcon, FootprintsIcon, PencilRulerIcon, RulerIcon, WeightIcon,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {RiInstagramLine} from "@remixicon/react";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import WrongDataContact from "@/components/data-info/WrongDataContact";
import PlayerStatisticRadar from "@/components/charts/PlayerStatisticRadar";
import DetailsPageMenu from "@/components/menu/DetailsPageMenu";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

/**
 * Props passed from server component
 * All data is pre-fetched and validated on the server
 */
interface PlayerInfoProps {
    idGiocatore: number;
    datiGiocatore: datiGiocatoreType;
    statistiche?: statisticheGiocatoreType;
    datiSquadra?: datiSquadraType;
    formazioneSquadra?: formazioneSquadraType;
}

/**
 * Client component - only handles UI state and interactivity
 * All data comes from props (fetched server-side)
 */
export default function PlayerInfo(props: PlayerInfoProps) {
    // UI state
    const [showAsSilhouette, setShowAsSilhouette] = useState(true);

    const {
        datiGiocatore: datiGiocatore,
        statistiche,
        datiSquadra,
        formazioneSquadra,
    } = props;

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    const stemmaSquadra = datiSquadra?.link_stemma ?? DEFAULT_LOGO_PATH;
    const coloreSquadra = datiSquadra?.colore_squadra ? datiSquadra.colore_squadra : DEFAULT_COLORE_SQUADRA_CASA;
    const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, DEFAULT_BACKGROUND_COLOR) > DEFAULT_CONTRAST_RATIO
        ? coloreSquadra
        : DEFAULT_FALLBACK_COLOR;

    const [playerSilhouette, setPlayerSilhouette] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
        generatePlayerSilhouette(coloreSquadra, stemmaSquadra || undefined, DEFAULT_LOGO_PATH)
            .then(setPlayerSilhouette)
            .catch(err => console.error("Errore in generatePlayerSilhouette(): ", err));
    }, [coloreSquadra, stemmaSquadra]);

    if (!datiGiocatore || !datiSquadra || !statistiche) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <ErrorInfo infoMessage={"Errore durante il recupero del giocatore"} />
                    <Link href="/" className={"w-full flex justify-center"}>
                        <Button variant="outline" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                            Torna alla Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={"page-container"}>
            <div className={"page-content mt-6 lg:mt-12"}>
                <DetailsPageMenu
                    pageTitle={"Dettagli giocatore"}
                />

                <div className={"sm:flex items-center w-full gap-10"}>
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
                                        {datiGiocatore.nome_maglia}
                                    </span>
                                    {
                                        datiGiocatore.is_capitano && (
                                            <span className={"text-[0.6em]"} style={{color: coloreLeggibile}} >
                                                Capitano
                                            </span>
                                        )
                                    }
                                </div>
                                <span>
                                    {datiGiocatore.numero_maglia && "#" + datiGiocatore.numero_maglia}
                                </span>
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className={"flex justify-center"}
                        >
                            <div className={`player-anim-hover max-w-64 pt-5 px-4 translate-y-5`}>
                                <PlayerSilhouette
                                    silhouetteTemplate={playerSilhouette}
                                    playerImage={datiGiocatore.link_foto}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        variants={slideAnim}
                        initial={"start"}
                        animate={"finish"}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className={"w-full mt-6 sm:mt-0"}
                    >
                        <div className={"tracking-wide flex flex-col min-w-0"}>
                            <Link
                                href={`/squadre/dettagli?id=${datiSquadra.id}`}
                                className={"flex items-center gap-2"}
                            >
                                <Image
                                    src={datiSquadra.link_stemma || DEFAULT_LOGO_PATH}
                                    alt="Stemma squadra"
                                    width={30}
                                    height={30}
                                    className={`bg-none rounded-full object-cover`}
                                    draggable={false}
                                    loading={"lazy"}
                                />
                                <div className={"integral-title-italic font-semibold text-sm sm:text-lg pb-1.5"}>
                                    <span
                                        className={`w-full overflow-hidden text-ellipsis`}
                                        style={{color: coloreLeggibile}}
                                    >
                                        {datiSquadra.nome}
                                    </span>
                                </div>
                            </Link>
                            <div className={"integral-title-italic font-bold text-3xl sm:text-4xl lg:text-5xl min-w-0"}>
                                <span className={`shine-anim-hover px-1 block overflow-hidden text-ellipsis`}>
                                    {datiGiocatore.nome + " " + datiGiocatore.cognome}
                                </span>
                            </div>

                            <motion.div
                                variants={slideAnim}
                                initial={"start"}
                                animate={"finish"}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className={"flex gap-2 integral-title mt-4"}
                            >
                                {
                                    datiGiocatore.username_ig && (
                                        <Link
                                            href={`https://www.instagram.com/${datiGiocatore.username_ig}`}
                                            target={"_blank"}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={"cursor-pointer"}
                                                style={{color: coloreLeggibile}}
                                            >
                                                <RiInstagramLine />
                                                <span className={"not-italic -translate-y-0.5"}>
                                            Profilo IG
                                        </span>
                                            </Button>
                                        </Link>
                                    )
                                }
                                <ShareProfileDialog
                                    datiGiocatore={datiGiocatore}
                                    datiSquadra={datiSquadra}
                                    statisticheGiocatore={statistiche}
                                    coloreSquadra={coloreSquadra}
                                />
                            </motion.div>
                        </div>

                        <Separator className={"my-3 sm:my-8 opacity-0 sm:opacity-100"} />

                        <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-8"}>
                            <div className={"grid grid-rows-2 gap-1"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                    <Calendar1 className={"size-4"} /> Età
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                    {
                                        datiGiocatore.data_nascita
                                            ? calcolaEta(new Date(datiGiocatore.data_nascita)) + " anni"
                                            : "N/A"
                                    }
                                </div>
                            </div>
                            <div className={"grid grid-rows-2 gap-1"}>
                                <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-base"}>
                                    <PencilRulerIcon className={"size-4"} /> Ruolo principale
                                </div>
                                <div className={"text-zinc-100 font-bold text-xl md:text-xl"}>
                                    { datiGiocatore.ruolo_principale || "N/A" }
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
                                    { datiGiocatore.piede_principale || "N/A" }
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

                <Tabs defaultValue="statistiche" className={"mt-8 sm:mt-16"}>
                    <ScrollArea className="w-full overflow-y-clip mb-2">
                        <TabsList variant="line" className={"py-1"}>
                            <TabsTrigger value="statistiche" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Statistiche
                            </TabsTrigger>
                            <TabsTrigger value="compagni" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Compagni
                            </TabsTrigger>
                            <TabsTrigger value="trofei" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Trofei
                            </TabsTrigger>
                            <TabsTrigger value="carriera" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Carriera
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" className={"hidden"} />
                    </ScrollArea>

                    <Separator className={"mb-4 sm:mb-10"} />

                    <TabsContent value="statistiche" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold mb-6 sm:mb-10"}>
                            Statistiche all-time
                        </div>

                        <div className={"w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-6"}>
                            <div className={"w-full lg:max-w-[800px]"}>
                                <PlayerStatisticRadar
                                    coloreSquadra={coloreLeggibile}
                                    mvp={statistiche[0]?.num_mvp || 0}
                                    goal={statistiche.find(s => s.a_tipo === "Goal")?.total || 0}
                                    assist={statistiche.find(s => s.a_tipo === "Assist")?.total || 0}
                                    gialli={statistiche.find(s => s.a_tipo === "Cartellino giallo")?.total || 0}
                                    rossi={statistiche.find(s => s.a_tipo === "Cartellino rosso")?.total || 0}
                                />
                            </div>
                            <div className={"w-full grid grid-cols-2 md:grid-cols-3 justify-items-center gap-x-4 gap-y-6 sm:gap-y-8"}>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche[0]?.n_partite || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        Partite giocate
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche.find(s => s.a_tipo === "Goal")?.total || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        Goal segnati
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche.find(s => s.a_tipo === "Assist")?.total || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        Assist
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche.find(s => s.a_tipo === "Cartellino giallo")?.total || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        Cartellini gialli
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche.find(s => s.a_tipo === "Cartellino rosso")?.total || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        Cartellini rossi
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        {statistiche[0]?.num_mvp || 0}
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-5 sm:translate-y-2.5"}>
                                        MVP totali
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="compagni" className={"sm:pt-2"}>
                        <div className={"flex flex-row sm:items-center justify-between gap-2 mb-8"}>
                            <div className={"text-hover-color text-2xl md:text-4xl font-extrabold mb-2 sm:mb-0"}>
                                Compagni di squadra
                            </div>
                            <FormationFilters
                                showAsSilhouette={showAsSilhouette}
                                setShowAsSilhouette={setShowAsSilhouette}
                            />
                        </div>
                        {
                            formazioneSquadra && formazioneSquadra.length > 0 ? (
                                <FormationList
                                    showAsSilhouette={showAsSilhouette}
                                    showBadgeCapitani={true}
                                    stemmaSquadra={stemmaSquadra}
                                    coloreSquadra={coloreSquadra}
                                    formazioneSquadra={formazioneSquadra}
                                />
                            ) : (
                                <div className={"w-full"}>
                                    <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                        Nessuna formazione trovata dall&#39;ultima edizione.
                                    </div>
                                </div>
                            )
                        }
                    </TabsContent>

                    <TabsContent value="trofei" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold"}>
                            Trofei ottenuti
                        </div>
                        <div className={"text-zinc-400 font-semibold italic text-lg sm:text-xl mt-2 sm:mt-4"}>
                            Presto in arrivo...
                        </div>
                    </TabsContent>

                    <TabsContent value="carriera" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold"}>
                            Storico carriera
                        </div>
                        <div className={"text-zinc-400 font-semibold italic text-lg sm:text-xl mt-2 sm:mt-4"}>
                            Presto in arrivo...
                        </div>
                    </TabsContent>
                </Tabs>

                <WrongDataContact />

            </div>
        </div>
    )
}