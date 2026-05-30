'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {useState} from "react";
import {usePathname} from "next/navigation";

import {datiSquadraType, formazioneSquadraType, statisticheSquadraType} from "@/server/data/teams";
import {partiteSquadraType} from "@/server/data/fixtures";
import {listaTorneiType} from "@/server/data/rankings";
import {FormationList} from "@/components/formation/FormationList";
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_COLORE_SQUADRA_CASA,
    DEFAULT_CONTRAST_RATIO,
    DEFAULT_FALLBACK_COLOR,
    DEFAULT_LOGO_PATH
} from "@/const/defaultConstants";
import {calcolaRapportoContrasto} from "@/lib/utils";

import ErrorInfo from "@/components/data-info/ErrorInfo";
import WrongDataContact from "@/components/data-info/WrongDataContact";
import TeamStatisticRadar from "@/components/charts/TeamStatisticRadar";
import DetailsPageMenu from "@/components/menu/DetailsPageMenu";
import FormationFilters from "@/components/formation/FormationFilters";

import {
    CalendarCheckIcon,
    CalendarFoldIcon,
    CalendarMinusIcon,
    HistoryIcon,
    ShieldUserIcon,
    Tally5Icon,
} from "lucide-react";
import {RiInstagramLine} from "@remixicon/react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface statisticheTotaliType {
    totalePartite: number;
    totaleVittorie: number;
    totalePareggi: number;
    totaleSconfitte: number;
    totaleGoalSegnati: number;
    totaleGoalSubiti: number;
    totaleAssistCompiuti: number;
    totaleCartelliniGialli: number;
    totaleCartelliniRossi: number;
}

function aggregateStatisticheSquadra(
    statistiche: statisticheSquadraType,
    partite: partiteSquadraType,
    idSquadra: number
): statisticheTotaliType {
    const matchesMap = new Map<number, {
        goalSegnati: number;
        goalSubiti: number;
        assistCompiuti: number;
        cartelliniGialli: number;
        cartelliniRossi: number;
        vintaATabolino: "No" | "Casa" | "Ospiti";
        idSquadraCasa: number | null;
        idSquadraOspite: number | null;
    }>();

    statistiche?.forEach((row) => {
        const matchId = row.p_id || -1;

        if (!matchesMap.has(matchId)) {
            matchesMap.set(matchId, {
                goalSegnati: 0,
                goalSubiti: 0,
                assistCompiuti: 0,
                cartelliniGialli: 0,
                cartelliniRossi: 0,
                vintaATabolino: row.p_vinta_a_tavolino as "No" | "Casa" | "Ospiti",
                idSquadraCasa: row.p_id_squadra_casa,
                idSquadraOspite: row.p_id_squadra_ospite,
            });
        }

        const match = matchesMap.get(matchId)!;

        if (row.a_tipo === "Goal") {
            if (row.id_squadra_azione === idSquadra) {
                match.goalSegnati += 1;
            } else {
                match.goalSubiti += 1;
            }
        } else if (row.a_tipo === "Assist") {
            if (row.id_squadra_azione === idSquadra) {
                match.assistCompiuti += 1;
            }
        } else if (row.a_tipo === "Cartellino giallo") {
            if (row.id_squadra_azione === idSquadra) {
                match.cartelliniGialli += 1;
            }
        } else if (row.a_tipo === "Cartellino rosso") {
            if (row.id_squadra_azione === idSquadra) {
                match.cartelliniRossi += 1;
            }
        }
    });

    const totalePartite = partite?.length || 0;
    let totaleVittorie = 0;
    let totalePareggi = 0;
    let totaleSconfitte = 0;
    let totaleGoalSegnati = 0;
    let totaleGoalSubiti = 0;
    let totaleAssistCompiuti = 0;
    let totaleCartelliniGialli = 0;
    let totaleCartelliniRossi = 0;

    matchesMap.forEach((match) => {
        totaleGoalSegnati += match.goalSegnati;
        totaleGoalSubiti += match.goalSubiti;
        totaleAssistCompiuti += match.assistCompiuti;
        totaleCartelliniGialli += match.cartelliniGialli;
        totaleCartelliniRossi += match.cartelliniRossi;

        if (match.vintaATabolino !== "No") {
            // Vittoria a tavolino
            if (match.vintaATabolino === "Casa") {
                // Home team won
                if (idSquadra === match.idSquadraCasa) {
                    totaleVittorie += 1;
                } else {
                    totaleSconfitte += 1;
                }
            } else {
                // Away team won
                if (idSquadra === match.idSquadraOspite) {
                    totaleVittorie += 1;
                } else {
                    totaleSconfitte += 1;
                }
            }
        } else {
            // Normal match result based on goals
            if (match.goalSegnati > match.goalSubiti) {
                totaleVittorie += 1;
            } else if (match.goalSegnati === match.goalSubiti) {
                totalePareggi += 1;
            } else {
                totaleSconfitte += 1;
            }
        }
    });

    return {
        totalePartite,
        totaleVittorie,
        totalePareggi,
        totaleSconfitte,
        totaleGoalSegnati,
        totaleGoalSubiti,
        totaleAssistCompiuti,
        totaleCartelliniGialli,
        totaleCartelliniRossi,
    };
}

interface TeamInfoProps {
    idSquadra: number;
    idParamName: string;
    edizioneParamName: string;
    datiSquadra: datiSquadraType;
    listaTornei: listaTorneiType;
    partiteSquadra: partiteSquadraType;
    datiStatisticheSquadra: statisticheSquadraType;
    formazioneSquadra: formazioneSquadraType;
}

export default function Team(props: TeamInfoProps) {
    // UI state
    const [showAsSilhouette, setShowAsSilhouette] = useState(true);

    const pathname = usePathname();

    const {
        idSquadra = -1,
        idParamName = 'id',
        edizioneParamName = 'edizione',
        datiSquadra,
        listaTornei = [],
        partiteSquadra = [],
        datiStatisticheSquadra = [],
        formazioneSquadra = [],
    } = props;

    const statisticheSquadra = aggregateStatisticheSquadra(
        datiStatisticheSquadra,
        partiteSquadra,
        idSquadra
    );

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    const coloreSquadra = datiSquadra?.colore_squadra ? datiSquadra.colore_squadra : DEFAULT_COLORE_SQUADRA_CASA;
    const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, DEFAULT_BACKGROUND_COLOR) > DEFAULT_CONTRAST_RATIO
        ? coloreSquadra
        : DEFAULT_FALLBACK_COLOR;

    if (!datiSquadra || !datiSquadra || !statisticheSquadra) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <ErrorInfo infoMessage={"Errore durante il recupero della squadra"} />
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
                    pageTitle={"Dettagli squadra"}
                />

                <div className={"flex flex-row items-center ssm:items-start gap-4 sm:gap-6 mb-2 sm:mb-0 sm:mt-2"}>
                    <motion.div
                        variants={slideAnim}
                        initial={"start"}
                        animate={"finish"}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={"player-info-stemma"}
                    >
                        <Image
                            src={datiSquadra.link_stemma ?? DEFAULT_LOGO_PATH}
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
                        className={"flex flex-col justify-center sm:-translate-y-2 min-w-0"}
                    >
                        <div className={"integral-title font-semibold text-sm sm:text-lg lg:text-xl"}>
                                <span
                                    className={`w-full overflow-hidden text-ellipsis`}
                                    style={{color: coloreLeggibile}}
                                >
                                    {datiSquadra.acronimo || ""}
                                </span>
                        </div>
                        <div className="integral-title-italic font-bold text-3xl sm:text-4xl lg:text-6xl min-w-0">
                            <span className="shine-anim-hover block wrap-anywhere px-2 -translate-x-2">
                                {datiSquadra.nome}
                            </span>
                        </div>

                        {
                            datiSquadra.username_ig && (
                                <motion.div
                                    variants={slideAnim}
                                    initial={"start"}
                                    animate={"finish"}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    className={"flex gap-2 integral-title mt-2 sm:mt-4"}
                                >
                                    <Link
                                        href={`https://www.instagram.com/${datiSquadra.username_ig}`}
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
                                </motion.div>
                            )
                        }
                    </motion.div>
                </div>

                <div className={"w-full mt-6 sm:mt-8"}>
                    <div className={"grid grid-cols-2 lg:grid-cols-3 gap-3"}>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <ShieldUserIcon className={"size-5"} /> Capitano
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl truncate"}>
                                {
                                    datiSquadra.giocatore ? (
                                        <Link href={`/giocatori/dettagli?id=${datiSquadra.giocatore.id}`}>
                                            { datiSquadra.giocatore.nome + " " + datiSquadra.giocatore.cognome }
                                        </Link>
                                    ) : "N/A"
                                }
                            </div>
                        </div>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <HistoryIcon className={"size-5"} /> Iscritti nel
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl"}>
                                {
                                    partiteSquadra?.[0]?.fischio_inizio
                                        ? new Date(partiteSquadra[0].fischio_inizio).getFullYear()
                                        : "N/A"
                                }
                            </div>
                        </div>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <Tally5Icon className={"size-5"} /> Partite giocate
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl"}>
                                { (statisticheSquadra?.totalePartite) || 0 }
                            </div>
                        </div>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <CalendarCheckIcon className={"size-5"} /> Vittorie
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl"}>
                                { statisticheSquadra?.totaleVittorie || 0 }
                            </div>
                        </div>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <CalendarFoldIcon className={"size-5"} /> Pareggi
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl"}>
                                { statisticheSquadra?.totalePareggi || 0 }
                            </div>
                        </div>
                        <div
                            className={"stats-card grid grid-rows-2 gap-1 px-4 py-2 sm:p-5 rounded-lg"}
                            style={{ backgroundColor: coloreSquadra + "1a" }}
                        >
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-xs sm:text-lg"}>
                                <CalendarMinusIcon className={"size-5"} /> Sconfitte
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-lg sm:text-2xl"}>
                                { statisticheSquadra?.totaleSconfitte || 0 }
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="statistiche" className={"mt-6 sm:mt-12"}>
                    <ScrollArea className="w-full overflow-y-clip mb-2">
                        <TabsList variant="line" className={"py-1"}>
                            <TabsTrigger value="statistiche" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Statistiche
                            </TabsTrigger>
                            <TabsTrigger value="rosa" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Rosa della squadra
                            </TabsTrigger>
                            <TabsTrigger value="classifiche" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Classifiche
                            </TabsTrigger>
                            <TabsTrigger value="storico" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Storico partite
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" className={"hidden"} />
                    </ScrollArea>

                    <Separator className={"mb-4 sm:mb-10"} />

                    <TabsContent value="statistiche" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold mb-10"}>
                            Statistiche all-time
                        </div>

                        <div className={"w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-6"}>
                            <div className={"w-full lg:max-w-[800px]"}>
                                <TeamStatisticRadar
                                    coloreSquadra={coloreLeggibile}
                                    goalSegnati={statisticheSquadra?.totaleGoalSegnati || 0}
                                    goalSubiti={statisticheSquadra?.totaleGoalSubiti || 0}
                                    assist={statisticheSquadra?.totaleAssistCompiuti || 0}
                                    gialli={statisticheSquadra?.totaleCartelliniGialli || 0}
                                    rossi={statisticheSquadra?.totaleCartelliniRossi || 0}
                                />
                            </div>
                            <div className={"w-full grid grid-cols-2 md:grid-cols-3 justify-items-center gap-x-4 gap-y-6 sm:gap-y-12"}>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { statisticheSquadra?.totaleGoalSegnati || 0 }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Goal segnati
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { statisticheSquadra?.totaleGoalSubiti || 0 }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Goal subiti
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { (statisticheSquadra?.totaleGoalSegnati || 0) - (statisticheSquadra?.totaleGoalSubiti || 0) }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Differenza reti
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { statisticheSquadra?.totaleAssistCompiuti || 0 }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Assist totali
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { statisticheSquadra?.totaleCartelliniGialli || 0 }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Cartellini gialli
                                    </div>
                                </div>
                                <div className={"grid grid-rows-2 text-center"}>
                                    <div
                                        className={"integral-title text-zinc-100 font-bold text-5xl"}
                                        style={{ color: coloreLeggibile }}
                                    >
                                        { statisticheSquadra?.totaleCartelliniRossi || 0 }
                                    </div>
                                    <div className={"text-zinc-400 font-semibold text-lg md:text-xl translate-y-3 sm:translate-y-2.5"}>
                                        Cartellini rossi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="rosa" className={"sm:pt-2"}>
                        <div className={"flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8"}>
                            <div className={"text-hover-color text-2xl md:text-4xl font-extrabold mb-2 sm:mb-0"}>
                                Rosa della squadra
                            </div>
                            <FormationFilters
                                showAsSilhouette={showAsSilhouette}
                                setShowAsSilhouette={setShowAsSilhouette}
                                pathname={pathname}
                                idSquadra={idSquadra}
                                squadraParamName={idParamName}
                                edizioneParamName={edizioneParamName}
                                listaTornei={listaTornei}
                            />
                        </div>
                        {
                            formazioneSquadra && formazioneSquadra.length > 0 ? (
                                <FormationList
                                    showAsSilhouette={showAsSilhouette}
                                    showBadgeCapitani={true}
                                    idCapitano={datiSquadra.giocatore?.id || -1}
                                    stemmaSquadra={datiSquadra.link_stemma}
                                    coloreSquadra={coloreSquadra}
                                    formazioneSquadra={formazioneSquadra}
                                />
                            ) : (
                                <div className={"w-full"}>
                                    <div className={"text-zinc-400 font-semibold text-md md:text-2xl"}>
                                        Nessuna formazione trovata.
                                    </div>
                                </div>
                            )
                        }
                    </TabsContent>

                    <TabsContent value="classifiche" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold"}>
                            Classifiche all-time
                        </div>
                        <div className={"text-zinc-400 font-semibold italic text-lg sm:text-xl mt-2 sm:mt-4"}>
                            Presto in arrivo...
                        </div>
                    </TabsContent>

                    <TabsContent value="storico" className={"sm:pt-2"}>
                        <div className={"text-hover-color text-2xl md:text-4xl font-extrabold"}>
                            Storico partite
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