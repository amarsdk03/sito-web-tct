'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {Suspense, useEffect, useRef, useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";

import {
    datiSquadraType, formazioneSquadraType,
    getDatiSquadra, getFormazioneSquadra,
    getStatisticheSquadra,
    statisticheSquadraType
} from "@/features/squadre/queries";
import {getPartiteSquadra, partiteSquadraType} from "@/features/partite/queries";
import {getListaTornei, listaTorneiType} from "@/features/tornei/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import {TeamFormationList} from "@/features/squadre/components/TeamFormationList";
import TeamFormationFilters from "@/features/squadre/components/TeamFormationFilters";

import {
    ShieldUserIcon,
    HistoryIcon,
    Tally5Icon,
    CalendarCheckIcon,
    CalendarFoldIcon,
    CalendarMinusIcon,
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {RiInstagramLine} from "@remixicon/react";
import {Spinner} from "@/components/ui/spinner";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import {calcolaRapportoContrasto} from "@/lib/utils";
import {BACKGROUND_COLOR, CONTRAST_RATIO} from "@/const/main-constants";
import WrongDataContact from "@/components/data-info/WrongDataContact";

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
    const torneoParamName = 't';
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
    const [error, setError] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                const [resultDatiSquadra, resultPartiteSquadra, resultStatisticheSquadra, resultFormazioneSquadra] = await Promise.all([
                    getDatiSquadra(idSquadra),
                    getPartiteSquadra(idSquadra),
                    getStatisticheSquadra(idSquadra),
                    getFormazioneSquadra(idSquadra, idTorneo)
                ]);

                const objectStatisticheSquadra = aggregateStatisticheSquadra(
                    resultStatisticheSquadra,
                    resultPartiteSquadra,
                    idSquadra
                );

                setDatiSquadra(resultDatiSquadra);
                setPartiteSquadra(resultPartiteSquadra);
                setStatisticheSquadra(objectStatisticheSquadra);

                // Aspetto 1 secondo per lasciare che le animazioni dei motion.div siano eseguite senza lag
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setFormazioneSquadra(resultFormazioneSquadra);
                }, 500);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [idSquadra, idTorneo]);

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    const coloreSquadra = datiSquadra?.colore_squadra ? datiSquadra.colore_squadra : "#dddddd";
    const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, BACKGROUND_COLOR) > CONTRAST_RATIO
        ? coloreSquadra
        : "#bdbdbd";

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
                </div>
            </div>
        )
    }

    return (
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
                            src={datiSquadra.link_stemma ?? "/logo_eagle_only.png"}
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
                                    style={{color: coloreLeggibile}}
                                >
                                    {datiSquadra.acronimo || ""}
                                </span>
                        </div>
                        <div className={"font-bold text-3xl sm:text-4xl lg:text-6xl -translate-x-1 min-w-0"}>
                            <span className={`player-info-title shine-anim-hover block overflow-hidden text-ellipsis pe-2`}>
                                {datiSquadra.nome}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {
                    datiSquadra.username_ig && (
                        <motion.div
                            variants={slideAnim}
                            initial={"start"}
                            animate={"finish"}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className={"flex gap-2 integral-title mt-4 sm:mb-6"}
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

                <Separator className={"mt-4 mb-8 sm:mb-14"} />

                <div className={"w-full"}>
                    <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-8 sm:mb-10"}>
                        Info principali
                    </div>

                    <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-10"}>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <ShieldUserIcon className={"size-5"} /> Capitano
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                {
                                    datiSquadra.giocatore ? (
                                        <Link href={`/giocatori/dettagli?id=${datiSquadra.giocatore.id}`}>
                                            { datiSquadra.giocatore.nome + " " + datiSquadra.giocatore.cognome }
                                        </Link>
                                    ) : "N/A"
                                }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <HistoryIcon className={"size-5"} /> Iscritti nel
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                {
                                    partiteSquadra?.[0]?.fischio_inizio
                                        ? new Date(partiteSquadra[0].fischio_inizio).getFullYear()
                                        : "N/A"
                                }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <Tally5Icon className={"size-5"} /> Partite giocate
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                { (statisticheSquadra?.totalePartite) || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <CalendarCheckIcon className={"size-5"} /> Vittorie
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                { statisticheSquadra?.totaleVittorie || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <CalendarFoldIcon className={"size-5"} /> Pareggi
                            </div>
                            <div className={"text-hover-color flex gap-1.5 items-center text-zinc-100 font-bold text-xl md:text-3xl translate-y-0.25"}>
                                { statisticheSquadra?.totalePareggi || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2 gap-1.5"}>
                            <div className={"flex gap-1.5 items-center text-zinc-400 font-semibold text-sm md:text-xl"}>
                                <CalendarMinusIcon className={"size-5"} /> Sconfitte
                            </div>
                            <div className={"text-hover-color text-zinc-100 font-bold text-xl md:text-3xl"}>
                                { statisticheSquadra?.totaleSconfitte || 0 }
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
                                { statisticheSquadra?.totaleGoalSegnati || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Goal subiti
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                { statisticheSquadra?.totaleGoalSubiti || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Differenza reti
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                { (statisticheSquadra?.totaleGoalSegnati || 0) - (statisticheSquadra?.totaleGoalSubiti || 0) }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Assist totali
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                { statisticheSquadra?.totaleAssistCompiuti || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Cartellini gialli
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                { statisticheSquadra?.totaleCartelliniGialli || 0 }
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Cartellini rossi
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-2.5"}>
                                { statisticheSquadra?.totaleCartelliniRossi || 0 }
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className={"my-8 sm:my-16"} />

                <div className={"w-full mt-10"}>
                    <div className={"flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8"}>
                        <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-2 sm:mb-0"}>
                            Rosa della squadra
                        </div>
                        <TeamFormationFilters
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
                            <TeamFormationList
                                showAsSilhouette={showAsSilhouette}
                                showBadgeCapitani={true}
                                idCapitano={datiSquadra.giocatore?.id || -1}
                                stemmaSquadra={datiSquadra.link_stemma}
                                coloreSquadra={coloreSquadra}
                                formazioneSquadra={formazioneSquadra}
                            />
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

                <WrongDataContact />

            </div>
        </div>
    )
}