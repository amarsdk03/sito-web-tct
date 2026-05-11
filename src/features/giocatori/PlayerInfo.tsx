'use client';

import Link from "next/link";
import Image from "next/image";
import {Suspense, useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {motion} from "framer-motion";

import {calcolaEta, calcolaRapportoContrasto} from "@/lib/utils";
import {
    getProfiloGiocatore,
    getStatisticheGiocatore,
    profiloGiocatoreType,
    statisticheGiocatoreType
} from "@/features/giocatori/queries";
import {
    datiSquadraType,
    formazioneSquadraType,
    getDatiSquadra,
    getFormazioneSquadra,
    getIdSquadraGiocatore
} from "@/features/squadre/queries";
import {getListaTornei} from "@/features/tornei/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import PlayerSilhouette from "@/features/giocatori/components/PlayerSilhouette";
import DynamicReactFlag from "@/components/country-flags/DynamicReactFlag";
import ShareProfileDialog from "@/features/giocatori/components/ShareProfileDialog";
import TeamFormationFilters from "@/features/squadre/components/TeamFormationFilters";
import {TeamFormationList} from "@/features/squadre/components/TeamFormationList";
import AwardCardInfo from "@/components/awards/AwardCardInfo";

import {
    Calendar1,
    FlagIcon,
    FootprintsIcon,
    PencilRulerIcon,
    RulerIcon,
    WeightIcon,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Separator} from "@/components/ui/separator";
import {RiInstagramLine} from "@remixicon/react";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import {BACKGROUND_COLOR, CONTRAST_RATIO} from "@/const/main-constants";
import WrongDataContact from "@/components/data-info/WrongDataContact";

export default function PlayerInfo() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <PlayerInfoContent />
            </Suspense>
            <Footer />
        </>
    );
}

export function PlayerInfoContent() {
    const searchParams = useSearchParams();
    const idGiocatore = Number.parseInt(searchParams?.get("id") ?? "-1");

    // Dati richiesti per la pagina
    const [datiGiocatore, setDatiGiocatore] = useState<profiloGiocatoreType | null>(null);
    const [statisticheGiocatore, setStatisticheGiocatore] = useState<statisticheGiocatoreType | null>(null);
    const [datiSquadra, setDatiSquadra] = useState<datiSquadraType | null>(null);
    const [formazioneSquadra, setFormazioneSquadra] = useState<formazioneSquadraType | null>(null);

    const [showAsSilhouette, setShowAsSilhouette] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);

            try {
                const [resultDatiGiocatore, idSquadraResult, resultStatisticheGiocatore, tornei] = await Promise.all([
                    getProfiloGiocatore(idGiocatore),
                    getIdSquadraGiocatore(idGiocatore),
                    getStatisticheGiocatore(idGiocatore),
                    getListaTornei()
                ]);

                setDatiGiocatore(resultDatiGiocatore);
                setStatisticheGiocatore(resultStatisticheGiocatore);

                const idSquadra = idSquadraResult?.id_squadra || -1;
                const idUltimoTorneo = tornei[0]?.id || -1;

                const [resultDatiSquadra, resultFormazioneSquadra] = await Promise.all([
                    getDatiSquadra(idSquadra),
                    getFormazioneSquadra(idSquadra, idUltimoTorneo)
                ]);

                setDatiSquadra(resultDatiSquadra);

                // Salvo la formazione dell'ultimo torneo, ad esclusione del profilo del giocatore stesso
                const filteredFormazioneSquadra = resultFormazioneSquadra.filter(
                    p => p.giocatore.id !== idGiocatore
                );

                // Aspetto 1 secondo per lasciare che le animazioni dei motion.div siano eseguite senza lag
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setFormazioneSquadra(filteredFormazioneSquadra);
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
    }, [idGiocatore]);

    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: { opacity: 1, x: 0, },
    }

    const stemmaSquadra = datiSquadra?.link_stemma ?? "/logo_eagle_only.png";
    const coloreSquadra = datiSquadra?.colore_squadra ? datiSquadra.colore_squadra : "#dddddd";
    const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, BACKGROUND_COLOR) > CONTRAST_RATIO
        ? coloreSquadra
        : "#bdbdbd";

    if (loading) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <LoadingInfo infoMessage={"Caricamento giocatore..."} />
                </div>
            </div>
        )
    } else if (!datiGiocatore || !datiSquadra || !statisticheGiocatore || error) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <ErrorInfo infoMessage={"Errore durante il recupero del giocatore"} />
                </div>
            </div>
        )
    }

    return (
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
                                        {datiGiocatore.nome_maglia}
                                    </span>
                                    {
                                        datiGiocatore.is_capitano && (
                                            <span className={"text-[0.6em]"}
                                                  style={{color: coloreLeggibile}}
                                            >
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
                            <div
                                className={`player-anim-hover max-w-64 pt-5 px-4 translate-y-5`}>
                                <PlayerSilhouette
                                    teamColor={coloreSquadra}
                                    teamBadge={datiSquadra.link_stemma || undefined}
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
                        className={"w-full my-8"}
                    >
                        <div className={"integral-title tracking-wide flex flex-col min-w-0"}>
                            <Link
                                href={`/squadre/dettagli?id=${datiSquadra.id}`}
                                className={"flex items-center gap-2"}
                            >
                                <Image
                                    src={datiSquadra.link_stemma || "/logo_eagle_only.png"}
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
                                        style={{color: coloreLeggibile}}
                                    >
                                        {datiSquadra.nome}
                                    </span>
                                </div>
                            </Link>
                            <div className={"font-bold text-3xl sm:text-4xl lg:text-5xl min-w-0"}>
                                <span className={`player-info-title shine-anim-hover block overflow-hidden text-ellipsis`}>
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
                                    statisticheGiocatore={statisticheGiocatore}
                                    coloreSquadra={coloreSquadra}
                                />
                            </motion.div>
                        </div>

                        <Separator className={"my-6 sm:my-8"} />

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

                <Separator className={"my-8 sm:my-10"} />

                <div className={"w-full mt-10"}>
                    <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10"}>
                        Statistiche all-time
                    </div>

                    <div className={"grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-12"}>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Partite giocate
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore[0]?.n_partite || 0}
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Goal segnati
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore.find(s => s.a_tipo === "Goal")?.total || 0}
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Assist
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore.find(s => s.a_tipo === "Assist")?.total || 0}
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Cartellini gialli
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore.find(s => s.a_tipo === "Cartellino giallo")?.total || 0}
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                Cartellini rossi
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore.find(s => s.a_tipo === "Cartellino rosso")?.total || 0}
                            </div>
                        </div>
                        <div className={"grid grid-rows-2"}>
                            <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                                MVP totali
                            </div>
                            <div className={"integral-title-hover text-zinc-100 font-bold text-5xl -translate-y-5 sm:-translate-y-2.5"}>
                                {statisticheGiocatore[0]?.num_mvp || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className={"my-8 sm:my-16"} />

                <div className={"w-full mt-10"}>
                    <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                        Trofei ottenuti
                    </div>
                    <div className={"w-full italic"}>
                        <div className={"text-zinc-400 font-semibold text-md md:text-xl"}>
                            Sezione presto in arrivo...
                        </div>
                    </div>
                    {
                        /**
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
                        */
                    }
                </div>

                <Separator className={"my-8 sm:my-16"} />

                <div className={"w-full mt-10"}>
                    <div className={"flex flex-row sm:items-center justify-between gap-2 mb-8"}>
                        <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-2 sm:mb-0"}>
                            Compagni di squadra
                        </div>
                        <TeamFormationFilters
                            loading={loading}
                            showAsSilhouette={showAsSilhouette}
                            setShowAsSilhouette={setShowAsSilhouette}
                        />
                    </div>
                    {
                        formazioneSquadra && formazioneSquadra.length > 0 ? (
                            <TeamFormationList
                                showAsSilhouette={showAsSilhouette}
                                showBadgeCapitani={true}
                                stemmaSquadra={stemmaSquadra}
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
                    <div className={"text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                        Storico carriera
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