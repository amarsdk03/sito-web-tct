'use client';

import {Suspense, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {motion, AnimatePresence} from 'framer-motion';
import {getListaTornei, listaTorneiType} from "@/features/tornei/queries";
import {getListaSquadre, listaSquadreType} from "@/features/squadre/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import PageTitle from "@/components/text/PageTitle";
import TeamInfoCard from "@/features/squadre/components/TeamInfoCard";
import TeamSearchFilters from "@/features/squadre/components/TeamSearchFilters";

import {
    Empty, EmptyContent, EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import {Spinner} from "@/components/ui/spinner"
import {Separator} from "@/components/ui/separator";
import {SearchIcon, XIcon} from "lucide-react";

export type listaSquadreContateType = listaSquadreType & { n_giocatori: number };

export default function Teams() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <TeamsContent />
            </Suspense>
            <Footer />
        </>
    );
}
export function TeamsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchParamName = 'c';
    const torneoParamName = 't';
    const pageParamName = 'p';

    const searchQueryFromParams = searchParams?.get(searchParamName) ?? '';
    const torneoParam = searchParams?.get(torneoParamName) ?? null;
    const pageParam = Number.parseInt(searchParams?.get(pageParamName) ?? '1');

    const [listaTornei, setListaTornei] = useState<listaTorneiType>([]);
    const [listaSquadre, setListaSquadre] = useState<listaSquadreContateType[]>([]);
    const [searchInput, setSearchInput] = useState(searchQueryFromParams);

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
        (async () => {
            setError(false);
            setLoading(true);

            try {
                const selectedTorneoId = torneoParam ? Number.parseInt(torneoParam) : listaTornei[0]?.id;

                if (!selectedTorneoId) {
                    setLoading(false);
                    return;
                }

                const squadre = await getListaSquadre(
                    searchQueryFromParams,
                    selectedTorneoId,
                );

                // Raggruppo ogni riga della tabella in un singolo risultato, e conto il numero di iscrizioni
                const squadreMap = new Map<string, listaSquadreContateType>();

                squadre?.forEach((row) => {
                    const key = `${row.s_id}_${row.t_id}`;

                    if (!squadreMap.has(key)) {
                        squadreMap.set(key, {
                            ...row,
                            n_giocatori: 0,
                        });
                    }

                    const squad = squadreMap.get(key);
                    if (squad) {
                        squad.n_giocatori += 1;
                    }
                });

                setListaSquadre(Array.from(squadreMap.values()));
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
            <div className={"page-content mt-2 lg:mt-8"}>
                <PageTitle
                    title={"Squadre"}
                    description={""/*"Tutte le squadre iscritte alle varie edizioni del torneo, sia passate che attuali"*/}
                />
                <div className={"w-full font-medium text-base text-amber-200 mt-2"}>
                    NB: le squadre iscritte alle edizioni passate saranno aggiunte il prima possibile!
                </div>
                <div className={"w-full mt-6"}>
                    <Field className="w-full min-w-full sm:min-w-96">
                        <ButtonGroup>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Cerca per nome squadra"
                                aria-label="Cerca giocatore"
                                onChange={(e) => setSearchInput(e.target.value)}
                                value={searchInput}
                            />
                            <TeamSearchFilters
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
                                    onClick={() => router.push(pathname)}
                                >
                                    Ricarica pagina
                                </Button>
                            </EmptyContent>
                        </EmptyHeader>
                    </Empty>
                ) : loading ? (
                    <Empty className="w-full text-start text-zinc-500">
                        <EmptyHeader>
                            <EmptyTitle className="flex items-center justify-center text-xl">
                                <Spinner className="me-2" />
                                Ricerca in corso...
                            </EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <>
                        <motion.div
                            variants={containerAnim}
                            initial={"start"}
                            animate={"finish"}
                            className={"grid grid-cols-1 md:grid-cols-2 gap-4"}
                        >
                            <AnimatePresence>
                                {listaSquadre.map((infoSquadra) => (
                                    <motion.div
                                        key={infoSquadra.s_id}
                                        variants={itemAnim}
                                    >
                                        <TeamInfoCard infoSquadra={infoSquadra} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {listaSquadre.length === 0 ? (
                            <Empty className="w-full text-zinc-300">
                                <EmptyHeader>
                                    <EmptyTitle className="flex items-center justify-center text-2xl">
                                        <XIcon className="me-1" /> Nessun risultato trovato
                                    </EmptyTitle>
                                    <EmptyDescription className="text-base -translate-y-1">
                                        Prova a cambiare i filtri di ricerca
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <div className="text-center text-gray-500 mt-12">
                                Risultati totali: <b>{listaSquadre.length}</b>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}