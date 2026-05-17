'use client';

import type {KeyboardEvent} from "react";
import {Suspense, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from 'framer-motion';
import {getListaGiocatori, listaGiocatoriType} from "@/features/giocatori/queries";
import {getListaTornei, listaTorneiType} from "@/features/tornei/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import LoadingInfo from "@/components/data-info/LoadingInfo";

import PageTitle from "@/components/text/PageTitle";
import PlayerInfoCard from "@/features/giocatori/components/PlayerInfoCard";
import PlayerSearchFilters from "@/features/giocatori/components/PlayerSearchFilters";
import {SearchPagination} from "@/components/search/SearchPagination";

import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty"
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import {Spinner} from "@/components/ui/spinner"
import {Separator} from "@/components/ui/separator";
import {SearchIcon, XIcon} from "lucide-react";

export default function Players() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <PlayersContent />
            </Suspense>
            <Footer />
        </>
    );
}

export function PlayersContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchParamName = 'ricerca';
    const torneoParamName = 'edizione';
    const pageParamName = 'p';
    const maxResultsPerPage = 20;

    const searchQueryFromParams = searchParams?.get(searchParamName) ?? '';
    const torneoParam = searchParams?.get(torneoParamName) ?? null;
    const pageParam = Number.parseInt(searchParams?.get(pageParamName) ?? '1');

    const [listaTornei, setListaTornei] = useState<listaTorneiType>([]);
    const [listaGiocatori, setListaGiocatori] = useState<listaGiocatoriType[]>([]);
    const [searchInput, setSearchInput] = useState(searchQueryFromParams);

    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const tornei = await getListaTornei();
                setListaTornei(tornei);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            }
        })();
    }, []);

    useEffect(() => {
        // Non fare nulla finché listaTornei non è caricato
        if (listaTornei.length === 0) {
            return;
        }

        (async () => {
            setError(false);
            setLoading(true);

            try {
                const selectedTorneoId = torneoParam ? Number.parseInt(torneoParam) : listaTornei[0]?.id;

                if (!selectedTorneoId) {
                    setLoading(false);
                    return;
                }

                const giocatori = await getListaGiocatori(
                    searchQueryFromParams,
                    selectedTorneoId,
                    pageParam,
                    maxResultsPerPage,
                );
                setListaGiocatori(giocatori.result);
                setCount(giocatori.count || 0);
            }
            // eslint-disable-next-line
            catch (error: any) {
                // Handles "range not satisfiable" error - reset to page 1
                if (error.code === 'PGRST103') {
                    const params = new URLSearchParams();

                    params.set(searchParamName, searchQueryFromParams);
                    params.set(torneoParamName, torneoParam ?? listaTornei[0]?.id.toString() ?? '1');
                    params.set(pageParamName, '1');

                    router.push(`${pathname}?${params.toString()}`);
                } else {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [router, pathname, searchQueryFromParams, torneoParam, pageParam, listaTornei]);

    function handleSearch() {
        setError(false);
        const params = new URLSearchParams();

        params.set(searchParamName, searchInput);
        params.set(torneoParamName, torneoParam ?? listaTornei[0]?.id.toString() ?? '1');
        params.set(pageParamName, '1');

        router.push(`${pathname}?${params.toString()}`);
    }

    // Rest of your component...
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
                                loading={loading}
                                pathname={pathname}
                                torneoParamName={torneoParamName}
                                listaTornei={listaTornei}
                            />
                            <Button
                                variant="default"
                                aria-label="Effettua ricerca"
                                onClick={handleSearch}
                            >
                                { loading ? <Spinner /> : <SearchIcon /> }
                            </Button>
                        </ButtonGroup>
                    </Field>
                </div>

                <Separator className={"my-6"} />

                {error ? (
                    <Empty className="w-full text-red-300">
                        <EmptyHeader>
                            <EmptyTitle className="flex items-center justify-center text-2xl">
                                <XIcon className="me-1" /> Errore sconosciuto
                            </EmptyTitle>
                            <EmptyDescription className="text-base">
                                Prova a ricaricare la pagina o resetta i filtri di ricerca
                            </EmptyDescription>
                            <EmptyContent className={"pt-4"}>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchInput('');
                                        router.push(pathname);
                                    }}
                                >
                                    Ricarica pagina
                                </Button>
                            </EmptyContent>
                        </EmptyHeader>
                    </Empty>
                ) : loading ? (
                    <div className={"mt-12"}>
                        <LoadingInfo infoMessage={"Ricerca in corso..."} />
                    </div>
                ) : (
                    <>
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
                                    pageParamName={pageParamName}
                                    totalResults={count}
                                    resultsPerPage={maxResultsPerPage}
                                    currentPage={pageParam}
                                />
                                <div className="text-center text-zinc-500 mt-4">
                                    Risultati totali: <b>{count}</b>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}