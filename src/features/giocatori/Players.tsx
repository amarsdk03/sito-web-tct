'use client';

import type {KeyboardEvent} from "react";
import {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from 'framer-motion';

import PageTitle from "@/components/text/PageTitle";
import PlayerInfoCard from "@/features/giocatori/components/PlayerInfoCard";
import PlayerSearchFilters from "@/features/giocatori/components/PlayerSearchFilters";
import {SearchPagination} from "@/components/search/SearchPagination";

import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/components/ui/empty"
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import {Separator} from "@/components/ui/separator";
import {SearchIcon, XIcon} from "lucide-react";
import {listaTorneiType} from "@/server/data/rankings";
import {listaGiocatoriType} from "@/server/data/players";

interface PlayersProps {
    edizioneParamName: string;
    ricercaParamName: string;
    paginaParamName: string;
    listaTornei: listaTorneiType;
    listaGiocatori: listaGiocatoriType[];
    countTotaleGiocatori: number;
    numPagina: number;
    maxResultsPerPage: number;
}

export default function Players(props: PlayersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        edizioneParamName = 'edizione',
        ricercaParamName = 'ricerca',
        paginaParamName = 'p',
        listaTornei = [],
        listaGiocatori = [],
        countTotaleGiocatori = 0,
        numPagina = 1,
        maxResultsPerPage = 20,
    } = props;

    const edizioneParamValue = searchParams?.get(edizioneParamName) ?? '';
    const ricercaParamValue = searchParams?.get(ricercaParamName) ?? '';
    const [searchInput, setSearchInput] = useState(ricercaParamValue);

    function handleSearch() {
        const params = new URLSearchParams();

        params.set(edizioneParamName, edizioneParamValue ?? listaTornei[0]?.id.toString() ?? '1');
        params.set(ricercaParamName, searchInput);
        params.set(paginaParamName, '1');

        router.push(`${pathname}?${params.toString()}`);
    }

    const containerAnim = {
        start: {opacity: 0},
        finish: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemAnim = {
        start: {opacity: 0, y: -10},
        finish: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.5},
        },
    };

    return (
        <div className={"page-container"}>
            <div className={"page-content mt-6 lg:mt-12"}>
                <PageTitle
                    title={"Giocatori"}
                    description={"Tutti i giocatori iscritti alle varie edizioni del torneo, sia passate che attuali."}
                />
                <div className={"w-full text-sm text-amber-200 mt-3"}>
                    <b>NB:</b> alcuni giocatori delle edizioni prima del 2025/2026 potrebbero <b>non essere disponibili</b>
                </div>
                <div className={"w-full mt-6"}>
                    <Field className="w-full min-w-full sm:min-w-96">
                        <ButtonGroup>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Cerca per nome, cognome..."
                                aria-label="Cerca giocatore"
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                value={searchInput}
                            />
                            <PlayerSearchFilters
                                pathname={pathname}
                                edizioneParamName={edizioneParamName}
                                listaTornei={listaTornei}
                            />
                            <Button
                                variant="default"
                                aria-label="Effettua ricerca"
                                onClick={handleSearch}
                            >
                                <SearchIcon />
                            </Button>
                        </ButtonGroup>
                    </Field>
                </div>

                <Separator className={"my-6"} />

                <motion.div
                    variants={containerAnim}
                    initial={"start"}
                    animate={"finish"}
                    className={"grid grid-cols-1 md:grid-cols-2 gap-4"}
                >
                    <AnimatePresence>
                        {listaGiocatori.map((infoGiocatore) => (
                            <motion.div
                                key={infoGiocatore.g_id}
                                variants={itemAnim}
                            >
                                <PlayerInfoCard infoGiocatore={infoGiocatore} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {listaGiocatori.length === 0 ? (
                    <Empty className="w-full text-zinc-300">
                        <EmptyHeader>
                            <EmptyTitle className="flex items-center justify-center text-xl sm:text-2xl">
                                <XIcon className="me-1" /> Nessun risultato trovato
                            </EmptyTitle>
                            <EmptyDescription className="text-sm sm:text-base">
                                Prova a cambiare i filtri di ricerca
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className={"mt-12"}>
                        <SearchPagination
                            pathname={pathname}
                            searchParams={searchParams}
                            paginaParamName={paginaParamName}
                            totalResults={countTotaleGiocatori}
                            resultsPerPage={maxResultsPerPage}
                            currentPage={numPagina}
                        />
                        <div className="text-center text-zinc-500 mt-4">
                            Risultati totali: <b>{countTotaleGiocatori}</b>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}