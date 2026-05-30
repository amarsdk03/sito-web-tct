'use client';

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {useMemo, useState} from "react";

import {calcolaClassifiche, calcolaStatoPartita, string_to_snake_case} from "@/lib/utils";
import {
    azioniPartitaType,
    contentPartitaType,
    datiCampoType,
    datiPartitaType,
    listaPartiteType
} from "@/server/data/fixtures";
import {formazioneSquadraType} from "@/server/data/teams";

import WrongDataContact from "@/components/data-info/WrongDataContact";
import FixtureActionList from "@/features/partite/components/FixtureActionList";
import {FormationList} from "@/components/formation/FormationList";
import {DEFAULT_COLORE_SQUADRA_CASA, DEFAULT_COLORE_SQUADRA_OSPITE} from "@/const/defaultConstants";

import {Badge} from "@/components/ui/badge";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {RiCheckboxBlankCircleFill} from "@remixicon/react";
import {HourglassIcon, TextIcon, UserIcon} from "lucide-react";
import DetailsPageMenu from "@/components/menu/DetailsPageMenu";
import {Separator} from "@/components/ui/separator";
import YoutubeEmbed from "@/components/social/YoutubeEmbed";
import RankingTable from "@/features/tornei/components/RankingTable";
import {categorieClassificaType} from "@/server/data/rankings";

/**
 * Props passed from server component
 * All data is pre-fetched and validated on the server
 */
interface FixtureInfoProps {
    idPartita: number;
    datiPartita: datiPartitaType;
    azioniPartita?: azioniPartitaType;
    formazioneCasa?: formazioneSquadraType;
    formazioneOspite?: formazioneSquadraType;
    listaPartite?: listaPartiteType;
    categorieClassifica?: categorieClassificaType;
    contentPartita?: contentPartitaType;
    datiCampo?: datiCampoType;
}

/**
 * Client component - only handles UI state and interactivity
 * All data comes from props (fetched server-side)
 */
export default function FixtureInfo(props: FixtureInfoProps) {
    // UI state
    const [switchFormationTeam, setSwitchFormationTeam] = useState(true);
    const [switchFormationView, setSwitchFormationView] = useState(true);

    const {
        datiPartita: datiPartita,
        azioniPartita = [],
        formazioneCasa = [],
        formazioneOspite = [],
        listaPartite = [],
        categorieClassifica = [],
        contentPartita,
        datiCampo,
    } = props;

    const marcatoriGoal = useMemo(() => {
        if (!azioniPartita || azioniPartita.length === 0) {
            return {home: [], away: []};
        }

        const marcatori = {
            home: new Map<string, { count: number; types: (string | null)[] }>(),
            away: new Map<string, { count: number; types: (string | null)[] }>(),
        };

        azioniPartita.forEach((azione) => {
            if (!azione.a_tipo || !["Goal", "Goal su rigore", "Autogoal"].includes(azione.a_tipo)) return;

            const nomeGiocatore = azione.p_nome && azione.p_cognome
                ? `${azione.p_nome} ${azione.p_cognome}`
                : "";

            const isHomeTeam = azione.id_squadra_azione === azione.p_id_squadra_casa;
            const scoringTeam = azione.a_tipo === "Autogoal"
                ? (isHomeTeam ? "away" : "home")
                : (isHomeTeam ? "home" : "away");

            if (!marcatori[scoringTeam].has(nomeGiocatore)) {
                marcatori[scoringTeam].set(nomeGiocatore, {count: 0, types: []});
            }

            const current = marcatori[scoringTeam].get(nomeGiocatore)!;
            current.count += 1;
            current.types.push(azione.a_tipo);
        });

        return {
            home: Array.from(marcatori.home.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                types: data.types,
            })),
            away: Array.from(marcatori.away.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                types: data.types,
            })),
        };
    }, [azioniPartita]);


    const classifiche = useMemo(() => calcolaClassifiche(listaPartite), [listaPartite]);
    const datiSquadre = (datiPartita?.categoria_nome && datiPartita?.girone)
        ? classifiche[datiPartita.categoria_nome]?.[datiPartita.girone] ?? []
        : [];

    const statoPartita = calcolaStatoPartita(
        datiPartita.fischio_inizio,
        datiPartita.durata_partita
    );
    const aiCalciDiRigore = (datiPartita.rigori_casa && datiPartita.rigori_casa > 0) ||
        (datiPartita.rigori_ospite && datiPartita.rigori_ospite > 0);
    const esitoRigori = (datiPartita.rigori_casa?.toString() || "?") + " - " +
        (datiPartita.rigori_ospite?.toString() || "?");

    const coloreCasa = datiPartita.squadra_casa_colore || DEFAULT_COLORE_SQUADRA_CASA;
    const coloreOspiti = datiPartita.squadra_ospite_colore || DEFAULT_COLORE_SQUADRA_OSPITE;
    const linkHighlights = contentPartita?.[0]?.highlights_yt || null;

    return (
        <div className={"page-container"}>
            <div className={"page-content mt-6 lg:mt-12"}>
                <DetailsPageMenu pageTitle={"Dettagli partita"}/>

                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: 0.1}}
                    className={"flex flex-col flex-wrap items-center mt-2 sm:mt-4 mb-2 sm:mb-0"}
                >
                    {
                        (() => {
                            switch (statoPartita) {
                                case "In arrivo":
                                    return (
                                        <Badge variant="outline"
                                               className={"font-bold text-sm sm:text-md py-2.5 ms-2"}>
                                            <HourglassIcon className={"me-0.5"}/>
                                            Prossimamente
                                        </Badge>
                                    );
                                case "In corso":
                                    return (
                                        <Badge variant="destructive"
                                               className={"font-bold text-sm sm:text-md py-2.5 ms-2"}>
                                            <RiCheckboxBlankCircleFill className={"live-circle me-0.5"}/>
                                            In corso
                                        </Badge>
                                    );
                                case "Terminata":
                                    return (
                                        <Badge variant="outline"
                                               className={"font-bold text-sm sm:text-md py-2.5 ms-2"}>
                                            Terminata
                                        </Badge>
                                    );
                                default:
                                    return <></>;
                            }
                        })()
                    }

                    <div
                        className={"w-full sm:w-1/2 integral-title-hover font-bold text-center flex text-6xl sm:text-7xl mb-3 sm:mb-4"}>
                        <span className={"flex-1"}>
                            {datiPartita.goal_casa ?? "?"}
                        </span>
                        <span className={"shrink-0 px-4 -translate-x-0.5"}>
                            {" - "}
                        </span>
                        <span className={"flex-1"}>
                            {datiPartita.goal_ospite ?? "?"}
                        </span>
                    </div>

                    {datiPartita.vinta_a_tavolino && datiPartita.vinta_a_tavolino !== "No"
                        ? (
                            <div
                                className={"integral-title font-semibold tracking-wider text-md sm:text-xl text-center text-mist-400 mt-1 mb-4 sm:mb-2"}>
                                {"Vittoria a tavolino - " + datiPartita.vinta_a_tavolino}
                            </div>
                        )
                        : aiCalciDiRigore === true && (
                            <div
                                className={"integral-title font-semibold tracking-widest text-2xl text-center text-mist-400 mb-4 sm:mb-2"}>
                                {esitoRigori + " D.C.R."}
                            </div>
                        )
                    }
                </motion.div>

                <div className={"grid grid-cols-5 items-center gap-6 w-full sm:mt-4"}>
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: 0.2}}
                        className={"text-hover-color col-span-2 text-start text-lg sm:text-2xl md:text-4xl text-mist-300 truncate font-extrabold overflow-hidden text-ellipsis"}
                    >
                        <Link href={"/squadre/dettagli?id=" + datiPartita.squadra_casa_id}>
                            {datiPartita.squadra_casa_nome ?? "???"}
                        </Link>
                    </motion.div>

                    <span
                        className={"match-result text-center text-lg sm:text-2xl text-chart-1 font-bold -translate-y-0.5"}>
                        {" vs "}
                    </span>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.3, delay: 0.2}}
                        className={"text-hover-color col-span-2 text-end text-lg sm:text-2xl md:text-4xl text-mist-300 truncate font-extrabold overflow-hidden text-ellipsis"}
                    >
                        <Link href={"/squadre/dettagli?id=" + datiPartita.squadra_ospite_id}>
                            {datiPartita.squadra_ospite_nome ?? "???"}
                        </Link>
                    </motion.div>
                </div>

                {(marcatoriGoal.home.length > 0 || marcatoriGoal.away.length > 0) && (
                    <div className={"grid grid-cols-2 gap-4 w-full"}>
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.3, delay: 0.25}}
                            className={"text-xs sm:text-base text-mist-400 font-bold"}
                        >
                            {marcatoriGoal.home.length > 0 && (
                                <div className={"flex items-center justify-start flex-col mt-4 sm:mt-4 gap-2"}>
                                    {marcatoriGoal.home.map((scorer, idx) => (
                                        <div key={idx} className="flex items-center justify-start gap-2 w-full">
                                            <div className="flex items-center justify-end gap-0.5">
                                                {Array.from({length: scorer.count}).map((_, i) => {
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
                                            <span className={"text-hover-color truncate text-ellipsis pe-0.5"}>
                                                {scorer.name.length > 0 ? scorer.name : <i>Sconosciuto</i>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.3, delay: 0.25}}
                            className={"text-xs sm:text-base text-mist-400 font-bold"}
                        >
                            {marcatoriGoal.away.length > 0 && (
                                <div className={"flex items-center justify-end flex-col mt-4 sm:mt-4 gap-2"}>
                                    {marcatoriGoal.away.map((scorer, idx) => (
                                        <div key={idx} className="flex items-center justify-end gap-2 w-full">
                                            <span className={"text-hover-color truncate text-ellipsis ps-0.5"}>
                                                {scorer.name.length > 0 ? scorer.name : <i>Sconosciuto</i>}
                                            </span>
                                            <div className="flex items-center justify-end gap-0.5">
                                                {Array.from({length: scorer.count}).map((_, i) => {
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
                )}

                <Separator className={"my-4 sm:my-8"}/>

                <Tabs defaultValue="info">
                    <ScrollArea className="w-full overflow-y-clip mb-4">
                        <TabsList variant="line" className={"py-1"}>
                            <TabsTrigger value="info" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Info partita
                            </TabsTrigger>
                            <TabsTrigger value="formazioni"
                                         className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Formazioni
                            </TabsTrigger>
                            <TabsTrigger value="statistiche"
                                         className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Statistiche
                            </TabsTrigger>
                            <TabsTrigger value="classifica"
                                         className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Classifica
                            </TabsTrigger>
                            <TabsTrigger value="h2h" className={"sm:text-lg pb-2 sm:pb-5 after:bg-chart-1"}>
                                Confronto H2H
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" className={"hidden"}/>
                    </ScrollArea>

                    <TabsContent value="info" className={"space-y-4"}>
                        {linkHighlights && (
                            <div className={"w-full bg-mist-800/50 p-4 sm:p-8 rounded-lg"}>
                                <div className={"space-y-1 col-span-3 mb-4 md:mb-5"}>
                                    <div className={"text-mist-400 text-xs md:text-sm"}>Da YouTube</div>
                                    <div className={"text-mist-200 font-bold text-xl md:text-2xl"}>
                                        Highlights / intervista partita
                                    </div>
                                </div>
                                <div className="w-full aspect-video rounded overflow-hidden">
                                    <YoutubeEmbed link={linkHighlights}/>
                                </div>
                            </div>
                        )}

                        <div className={"space-y-6 w-full bg-mist-800/50 p-6 rounded-lg"}>
                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Edizione torneo</div>
                                <Link
                                    href={`/classifiche?edizione=${datiPartita.torneo_id}`}
                                    className={"text-hover-color text-mist-300 font-semibold text-sm md:text-base text-end"}
                                >
                                    {datiPartita.torneo_nome}
                                </Link>
                            </div>

                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Categoria</div>
                                <Link
                                    href={`/classifiche?edizione=${datiPartita.torneo_id}&categoria=${datiPartita.categoria_id}`}
                                    className={"text-hover-color text-mist-300 font-semibold text-sm md:text-base text-end"}
                                >
                                    {datiPartita.categoria_nome}
                                </Link>
                            </div>

                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Fase e girone</div>
                                <Link
                                    href={`/classifiche?edizione=${datiPartita.torneo_id}&categoria=${datiPartita.categoria_id}&girone=${datiPartita.girone}`}
                                    className={"text-hover-color text-mist-300 font-semibold text-sm md:text-base text-end"}
                                >
                                    {datiPartita.fase || "???"}{datiPartita.giornata && " - Girone " + datiPartita.girone}
                                </Link>
                            </div>

                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Giornata</div>
                                <div
                                    className={"text-hover-color text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                    {datiPartita.giornata + "° giornata"}
                                </div>
                            </div>
                        </div>

                        <div className={"space-y-6 w-full bg-mist-800/50 p-6 rounded-lg"}>
                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Data e ora partita</div>
                                <div
                                    className={"text-hover-color text-mist-300 font-semibold text-sm md:text-base text-end"}>
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

                            <div className={"grid grid-cols-2 gap-4"}>
                                <div className={"text-mist-400 text-sm md:text-base"}>Arbitrato da</div>
                                <div
                                    className={"text-hover-color text-mist-500 font-semibold text-sm md:text-base text-end"}>
                                    {"Nessun arbitro specificato"}
                                </div>
                            </div>
                        </div>

                        {datiCampo?.[0] && (
                            <div className={"w-full grid md:grid-cols-7 bg-mist-800/50 p-6 rounded-lg"}>
                                <div className={"space-y-2 col-span-3 mb-8 sm:me-6"}>
                                    <div className={"text-mist-400 text-sm md:text-base"}>Luogo partita</div>
                                    <div className={"text-hover-color text-mist-200 font-bold text-xl md:text-2xl"}>
                                        {datiCampo[0].nome || "Non disponibile"}
                                    </div>
                                    <div className={"text-mist-300 font-medium text-sm md:text-base"}>
                                        {datiCampo[0].indirizzo || "Non disponibile"}
                                    </div>
                                </div>

                                {datiCampo[0].link_google_maps && (
                                    <div className={"w-full col-span-4 rounded"}>
                                        <iframe
                                            src={datiCampo[0].link_google_maps}
                                            width="100%"
                                            height="250"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="formazioni" className={"px-2 sm:px-0"}>
                        <div className={"w-full flex justify-center gap-4 mb-6 sm:mb-10"}>
                            <ToggleGroup
                                variant="outline"
                                type="single"
                                defaultValue={switchFormationTeam ? "home" : "away"}
                                onValueChange={(v) => {
                                    if (v) setSwitchFormationTeam(v === "home");
                                }}
                                className="w-full min-w-0"
                            >
                                <ToggleGroupItem
                                    value="home"
                                    aria-label="Squadra casa"
                                    className="w-1/2 min-w-0 px-2"
                                >
                                    <span
                                        className="block truncate w-full text-xs sm:text-sm translate-y-0.25 sm:translate-y-0">
                                        {datiPartita.squadra_casa_nome}
                                    </span>
                                </ToggleGroupItem>

                                <ToggleGroupItem
                                    value="away"
                                    aria-label="Squadra ospite"
                                    className="w-1/2 min-w-0 px-2"
                                >
                                    <span
                                        className="block truncate w-full text-xs sm:text-sm translate-y-0.25 sm:translate-y-0">
                                        {datiPartita.squadra_ospite_nome}
                                    </span>
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
                            {formazioneCasa && formazioneCasa.length > 0 ? (
                                <FormationList
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
                            )}
                        </div>

                        <div hidden={switchFormationTeam}>
                            {formazioneOspite && formazioneOspite.length > 0 ? (
                                <FormationList
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
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="statistiche" className={"px-2 sm:px-0"}>
                        {azioniPartita && azioniPartita.length > 0 ? (
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
                        )}
                    </TabsContent>

                    <TabsContent value="classifica">
                        <RankingTable
                            datiSquadre={datiSquadre}
                            mostraClassifiche={datiPartita.girone !== "Unico"}
                            mostraLeggenda={true}
                            numQualificate={categorieClassifica?.[0]?.num_qualificate}
                            numPlayoff={categorieClassifica?.[0]?.num_playoff}
                            numEliminate={categorieClassifica?.[0]?.num_eliminate}
                        />
                    </TabsContent>

                    <TabsContent value="h2h">
                        <div className={"text-zinc-400 font-semibold italic text-lg sm:text-xl"}>
                            Presto in arrivo...
                        </div>
                    </TabsContent>
                </Tabs>

                <WrongDataContact/>
            </div>
        </div>
    );
}