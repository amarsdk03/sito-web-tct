'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {Suspense, useEffect, useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";

import {
    datiSquadraType,
    formazioneSquadraType,
    getDatiSquadra,
    getFormazioneSquadra,
    getStatisticheSquadra,
    statisticheSquadraType
} from "@/features/squadre/queries";
import {getPartiteSquadra, partiteSquadraType} from "@/features/partite/queries";
import {getListaTornei, listaTorneiType} from "@/features/tornei/queries";
import {FormationList} from "@/components/formation/FormationList";
import {
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_COLORE_SQUADRA_CASA,
    DEFAULT_CONTRAST_RATIO,
    DEFAULT_FALLBACK_COLOR,
    DEFAULT_LOGO_PATH
} from "@/const/defaultConstants";
import {calcolaRapportoContrasto} from "@/lib/utils";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import LoadingInfo from "@/components/data-info/LoadingInfo";
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
import {Spinner} from "@/components/ui/spinner";
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
    squadId: number
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
            if (row.id_squadra_azione === squadId) {
                match.goalSegnati += 1;
            } else {
                match.goalSubiti += 1;
            }
        } else if (row.a_tipo === "Assist") {
            if (row.id_squadra_azione === squadId) {
                match.assistCompiuti += 1;
            }
        } else if (row.a_tipo === "Cartellino giallo") {
            if (row.id_squadra_azione === squadId) {
                match.cartelliniGialli += 1;
            }
        } else if (row.a_tipo === "Cartellino rosso") {
            if (row.id_squadra_azione === squadId) {
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
                if (squadId === match.idSquadraCasa) {
                    totaleVittorie += 1;
                } else {
                    totaleSconfitte += 1;
                }
            } else {
                // Away team won
                if (squadId === match.idSquadraOspite) {
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

export default function TeamInfo() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <TeamInfoContent />
            </Suspense>
            <Footer />
        </>
    );
}

export function TeamInfoContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const squadraParamName = 'id';
    const torneoParamName = 'edizione';
    const idSquadra = Number.parseInt(searchParams?.get(squadraParamName) ?? "-1");
    const [idTorneo, setIdTorneo] = useState(-1);

    // Dati richiesti per la pagina
    const [listaTornei, setListaTornei] = useState<listaTorneiType>([]);
    const [datiSquadra, setDatiSquadra] = useState<datiSquadraType | null>(null);
    const [partiteSquadra, setPartiteSquadra] = useState<partiteSquadraType | null>(null);
    const [statisticheSquadra, setStatisticheSquadra] = useState<statisticheTotaliType>();
    const [formazioneSquadra, setFormazioneSquadra] = useState<formazioneSquadraType | null>(null);

    const [showAsSilhouette, setShowAsSilhouette] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingFormazione, setLoadingFormazione] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const tornei = await getListaTornei();
                setListaTornei(tornei);
                setIdTorneo(Number.parseInt(searchParams?.get(torneoParamName) ?? tornei[0].id.toString()));
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            }
        })();
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);

            try {
                const [resultDatiSquadra, resultPartiteSquadra, resultStatisticheSquadra] = await Promise.all([
                    getDatiSquadra(idSquadra),
                    getPartiteSquadra(idSquadra),
                    getStatisticheSquadra(idSquadra),
                ]);

                if (!resultDatiSquadra || !resultDatiSquadra.id) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                const objectStatisticheSquadra = aggregateStatisticheSquadra(
                    resultStatisticheSquadra,
                    resultPartiteSquadra,
                    idSquadra
                );

                setDatiSquadra(resultDatiSquadra);
                setPartiteSquadra(resultPartiteSquadra);
                setStatisticheSquadra(objectStatisticheSquadra);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [idSquadra]);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoadingFormazione(true);

            try {
                const resultFormazioneSquadra = await getFormazioneSquadra(idSquadra, idTorneo);
                setFormazioneSquadra(resultFormazioneSquadra);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            }
            finally {
                setLoadingFormazione(false);
            }
        })();
    }, [idSquadra, idTorneo]);

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    const coloreSquadra = datiSquadra?.colore_squadra ? datiSquadra.colore_squadra : DEFAULT_COLORE_SQUADRA_CASA;
    const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, DEFAULT_BACKGROUND_COLOR) > DEFAULT_CONTRAST_RATIO
        ? coloreSquadra
        : DEFAULT_FALLBACK_COLOR;

    if (loading) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <LoadingInfo infoMessage={"Caricamento squadra..."} />
                </div>
            </div>
        )
    } else if (!datiSquadra || !datiSquadra || !statisticheSquadra || error) {
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

                <div className={"integral-title flex flex-row items-center ssm:items-start gap-4 sm:gap-6 mb-2 sm:mb-0 sm:mt-2"}>
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
                        <div className={"font-semibold text-sm sm:text-lg lg:text-xl translate-x-0.5 sm:translate-x-2"}>
                                <span
                                    className={`player-info-title w-full overflow-hidden text-ellipsis`}
                                    style={{color: coloreLeggibile}}
                                >
                                    {datiSquadra.acronimo || ""}
                                </span>
                        </div>
                        <div className="font-bold text-3xl sm:text-4xl lg:text-6xl min-w-0 sm:translate-x-0.5">
                            <span className="player-info-title shine-anim-hover block wrap-anywhere pe-1">
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

                        <div className={"w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-16"}>
                            <div className={"min-w-[300px] sm:mx-12"}>
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                        className={"integral-title-hover text-zinc-100 font-bold text-5xl"}
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
                                loading={loading}
                                showAsSilhouette={showAsSilhouette}
                                setShowAsSilhouette={setShowAsSilhouette}
                                pathname={pathname}
                                idSquadra={idSquadra}
                                squadraParamName={squadraParamName}
                                torneoParamName={torneoParamName}
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
                                        {
                                            loadingFormazione ? "Caricamento..." : "Nessuna formazione trovata."
                                        }
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