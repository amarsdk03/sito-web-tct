'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useMemo, useRef, useState} from "react";

import ErrorInfo from "@/components/data-info/ErrorInfo";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import {azioniPartitaType, datiPartitaType, getAzioniPartita, getDatiPartita} from "@/features/partite/queries";
import {formazioneSquadraType, getFormazioneSquadra} from "@/features/squadre/queries";
import {TeamFormationList} from "@/features/squadre/components/TeamFormationList";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {Spinner} from "@/components/ui/spinner";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {RiCheckboxBlankCircleFill} from "@remixicon/react";
import {TextIcon, UserIcon} from "lucide-react";
import FixtureActionList from "@/features/partite/components/FixtureActionList";
import {string_to_snake_case} from "@/lib/utils";
import WrongDataContact from "@/components/data-info/WrongDataContact";

export default function FixtureInfo() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <FixtureInfoContent />
            </Suspense>
            <Footer/>
        </>
    )
}

export function FixtureInfoContent() {
    const searchParams = useSearchParams();
    const idPartita = Number.parseInt(searchParams?.get('id') ?? '-1');

    // Dati richiesti per la pagina
    const [datiPartita, setDatiPartita] = useState<datiPartitaType | null>(null);
    const [azioniPartita, setAzioniPartita] = useState<azioniPartitaType | null>(null);
    const [formazioneCasa, setFormazioneCasa] = useState<formazioneSquadraType | null>(null);
    const [formazioneOspite, setFormazioneOspite] = useState<formazioneSquadraType | null>(null);

    const [switchFormationTeam, setSwitchFormationTeam] = useState(true);
    const [switchFormationView, setSwitchFormationView] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);

            try {
                const datiPartita = await getDatiPartita(idPartita);
                setDatiPartita(datiPartita);

                const idTorneo = datiPartita.torneo_id || -1;
                const idSquadraCasa = datiPartita.squadra_casa_id || -1;
                const idSquadraOspite = datiPartita.squadra_ospite_id || -1;

                const [resultAzioniPartita, resultFormazioneCasa, resultFormazioneOspite] = await Promise.all([
                    getAzioniPartita(idPartita),
                    getFormazioneSquadra(idSquadraCasa, idTorneo),
                    getFormazioneSquadra(idSquadraOspite, idTorneo)
                ]);

                setAzioniPartita(resultAzioniPartita);

                // Aspetto 1 secondo per lasciare che le animazioni dei motion.div siano eseguite senza lag
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setFormazioneCasa(resultFormazioneCasa);
                    setFormazioneOspite(resultFormazioneOspite);
                }, 500);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [idPartita]);

    const marcatoriGoal = useMemo(() => {
        if (!azioniPartita) return { home: [], away: [] };

        const marcatori = {
            home: new Map<string, { count: number; types: (string | null)[] }>(),
            away: new Map<string, { count: number; types: (string | null)[] }>()
        };

        azioniPartita.forEach((azione) => {
            // Conto solo azioni correlate a goal segnati
            if (!azione.a_tipo || !["Goal", "Calcio di rigore segnato", "Autogoal"].includes(azione.a_tipo)) return;

            const nomeGiocatore = azione.p_nome && azione.p_cognome
                ? `${azione.p_nome} ${azione.p_cognome}`
                : "Sconosciuto";

            const isHomeTeam = azione.id_squadra_azione === azione.p_id_squadra_casa;

            // Per gli autogoal, attribuisco al team opposto
            const scoringTeam = azione.a_tipo === "Autogoal"
                ? (isHomeTeam ? "away" : "home")
                : (isHomeTeam ? "home" : "away");

            if (!marcatori[scoringTeam].has(nomeGiocatore)) {
                marcatori[scoringTeam].set(nomeGiocatore, { count: 0, types: [] });
            }

            const current = marcatori[scoringTeam].get(nomeGiocatore)!;
            current.count += 1;
            current.types.push(azione.a_tipo);
        });

        return {
            home: Array.from(marcatori.home.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                types: data.types
            })),
            away: Array.from(marcatori.away.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                types: data.types
            }))
        };
    }, [azioniPartita]);

    if (loading) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <LoadingInfo infoMessage={"Caricamento partita..."} />
                </div>
            </div>
        )
    } else if (!datiPartita || error) {
        return (
            <div className={"page-container"}>
                <div className={"page-content my-48"}>
                    <ErrorInfo infoMessage={"Errore durante il recupero della partita"} />
                </div>
            </div>
        )
    }

    const inCorso = false;
    const aiCalciDiRigore = (datiPartita.rigori_casa && datiPartita.rigori_casa > 0) || (datiPartita.rigori_ospite && datiPartita.rigori_ospite > 0);
    const esitoRigori = (datiPartita.rigori_casa?.toString() || "?") + " - " + (datiPartita.rigori_ospite?.toString() || "?");

    const coloreCasa = datiPartita.squadra_casa_colore || "#dddddd";
    const coloreOspiti = datiPartita.squadra_ospite_colore || "#aaaaaa";

    return (
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
                            {datiPartita.goal_casa ?? "?"}
                        </span>
                        <span className={"flex-shrink-0 px-4 -translate-x-0.5"}>
                            {" - "}
                        </span>
                        <span className={"flex-1"}>
                            {datiPartita.goal_ospite ?? "?"}
                        </span>
                    </div>
                    {
                        datiPartita.vinta_a_tavolino && datiPartita.vinta_a_tavolino !== "No" ? (
                            <div className={"integral-title font-semibold tracking-wider text-md sm:text-xl text-center text-mist-400 mt-1 mb-4 sm:mb-2"}>
                                {"Vittoria a tavolino - " + datiPartita.vinta_a_tavolino}
                            </div>
                        ) : aiCalciDiRigore === true && (
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
                            href={"/squadre/dettagli?id=" + datiPartita.squadra_casa_id}
                        >
                            {datiPartita.squadra_casa_nome ?? "???"}
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
                            href={"/squadre/dettagli?id=" + datiPartita.squadra_ospite_id}
                        >
                            {datiPartita.squadra_ospite_nome ?? "???"}
                        </Link>
                    </motion.div>
                </div>

                <div className={"grid grid-cols-2 gap-4 w-full"}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className={"text-xs sm:text-base text-mist-400 font-bold"}
                    >
                        {marcatoriGoal.home.length > 0 && (
                            <div className={"flex items-center justify-start flex-col mt-4 sm:mt-4 gap-2"}>
                                {marcatoriGoal.home.map((scorer, idx) => (
                                    <div key={idx} className="flex items-center justify-start gap-2 w-full">
                                        <div className="flex items-center justify-end gap-0.5">
                                            {Array.from({ length: scorer.count }).map((_, i) => {
                                                const iconPath = string_to_snake_case(scorer.types[i]) || "goal";

                                                return (
                                                    <Image
                                                        key={i}
                                                        src={`/icons/${iconPath}.png`}
                                                        alt={"Goal"}
                                                        width={15}
                                                        height={15}
                                                        className={"action-icon"}
                                                    />
                                                );
                                            })}
                                        </div>

                                        <span className={"truncate text-ellipsis"}>
                                            {scorer.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className={"text-xs sm:text-base text-mist-400 font-bold"}
                    >
                        {marcatoriGoal.away.length > 0 && (
                            <div className={"flex items-center justify-end flex-col mt-4 sm:mt-4 gap-2"}>
                                {marcatoriGoal.away.map((scorer, idx) => (
                                    <div key={idx} className="flex items-center justify-end gap-2 w-full">
                                        <span className={"truncate text-ellipsis"}>
                                            {scorer.name}
                                        </span>

                                        <div className="flex items-center justify-end gap-0.5">
                                            {Array.from({ length: scorer.count }).map((_, i) => {
                                                const iconPath = string_to_snake_case(scorer.types[i]) || "goal";

                                                return (
                                                    <Image
                                                        key={i}
                                                        src={`/icons/${iconPath}.png`}
                                                        alt={"Goal"}
                                                        width={15}
                                                        height={15}
                                                        className={"action-icon"}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                <Separator className={"mt-8 sm:mt-8 mb-8"} />

                <div className={"space-y-6 w-full"}>
                    <div className={"grid grid-cols-2 gap-4"}>
                        <div className={"text-mist-400 text-sm md:text-base"}>
                            Edizione torneo
                        </div>
                        <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                            {datiPartita.torneo_nome}
                        </div>
                    </div>

                    <div className={"grid grid-cols-2 gap-4"}>
                        <div className={"text-mist-400 text-sm md:text-base"}>
                            Categoria
                        </div>
                        <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                            {datiPartita.categoria_nome}
                        </div>
                    </div>

                    <div className={"grid grid-cols-2 gap-4"}>
                        <div className={"text-mist-400 text-sm md:text-base"}>
                            Fase e giornata
                        </div>
                        <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                            {datiPartita.fase || "???"} {datiPartita.giornata && "- " + datiPartita.giornata + "° giornata"}
                        </div>
                    </div>

                    <div className={"grid grid-cols-2 gap-4"}>
                        <div className={"text-mist-400 text-sm md:text-base"}>
                            Data e ora partita
                        </div>
                        <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                            {datiPartita.fischio_inizio ? (
                                <>
                                    {new Date(datiPartita.fischio_inizio).toLocaleDateString('it-IT', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                    {" - "}
                                    {new Date(datiPartita.fischio_inizio).toLocaleTimeString('it-IT', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </>
                            ) : "TBD"}
                        </div>
                    </div>

                    <div className={"grid grid-cols-2 gap-4"} hidden>
                        <div className={"text-mist-400 text-sm md:text-base"}>
                            Luogo partita
                        </div>
                        <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                            {datiPartita.campo_svolgimento || "???"}
                        </div>
                    </div>
                </div>

                <Separator className={"mt-8 mb-8 sm:mb-14"} />

                <div>
                    <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-6 sm:mb-6"}>
                        Azioni principali
                    </div>
                    {
                        azioniPartita ? (
                            <FixtureActionList
                                azioniPartita={azioniPartita}
                                coloreSquadraCasa={coloreCasa}
                                coloreSquadraOspite={coloreOspiti}
                            />
                        ) : (
                            <div className={"w-full"}>
                                <div className={"text-zinc-400 font-semibold text-sm md:text-xl"}>
                                    Nessuna azione registrata per questa partita.
                                </div>
                            </div>
                        )
                    }
                </div>

                <Separator className={"my-8 sm:my-14"} />

                <div>
                    <div className={"text-hover-color text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6"}>
                        Formazioni squadre
                    </div>

                    <div className={"w-full flex justify-center gap-4 mt-6 mb-10"}>
                        <ToggleGroup
                            variant="outline"
                            type="single"
                            defaultValue={switchFormationTeam ? "home" : "away"}
                            onValueChange={(v) => {
                                setSwitchFormationTeam(v === "home");
                            }}
                            className={"w-full"}
                        >
                            <ToggleGroupItem value="home" aria-label="Squadra casa" className={"w-1/2"}>
                                { datiPartita.squadra_casa_nome }
                            </ToggleGroupItem>
                            <ToggleGroupItem value="away" aria-label="Squadra ospite" className={"w-1/2"}>
                                { datiPartita.squadra_ospite_nome }
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <ToggleGroup
                            variant="outline"
                            type="single"
                            defaultValue={switchFormationView ? "viewSilhouette" : "viewText"}
                            onValueChange={(v) => {
                                setSwitchFormationView(v === "viewSilhouette");
                            }}
                        >
                            <ToggleGroupItem value="viewText" aria-label="Come testo">
                                <TextIcon/>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="viewSilhouette" aria-label="Come immagini">
                                <UserIcon/>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div hidden={!switchFormationTeam}>
                        {
                            formazioneCasa && formazioneCasa.length > 0 ? (
                                <TeamFormationList
                                    showAsSilhouette={switchFormationView}
                                    showBadgeCapitani={true}
                                    stemmaSquadra={datiPartita.squadra_casa_stemma}
                                    coloreSquadra={coloreCasa}
                                    formazioneSquadra={formazioneCasa}
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
                    <div hidden={switchFormationTeam}>
                        {
                            formazioneOspite && formazioneOspite.length > 0 ? (
                                <TeamFormationList
                                    showAsSilhouette={switchFormationView}
                                    showBadgeCapitani={true}
                                    stemmaSquadra={datiPartita.squadra_ospite_stemma}
                                    coloreSquadra={coloreOspiti}
                                    formazioneSquadra={formazioneOspite}
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
                </div>

                <WrongDataContact />

            </div>
        </div>
    );
}