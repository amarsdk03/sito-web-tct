'use client';

import {type KeyboardEvent, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from 'framer-motion';

import {listaTorneiType} from "@/server/data/rankings";
import {listaSquadreContateType} from "@/app/squadre/page";

import PageTitle from "@/components/text/PageTitle";
import TeamInfoCard from "@/features/squadre/components/TeamInfoCard";
import TeamSearchFilters from "@/features/squadre/components/TeamSearchFilters";

import {Empty, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty"
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import {Separator} from "@/components/ui/separator";
import {SearchIcon, XIcon} from "lucide-react";

interface TeamsProps {
    edizioneParamName: string;
    ricercaParamName: string;
    listaTornei: listaTorneiType;
    listaSquadre: listaSquadreContateType[];
}

export default function Teams(props: TeamsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        edizioneParamName = 'edizione',
        ricercaParamName = 'ricerca',
        listaTornei = [],
        listaSquadre = [],
    } = props;

    const edizioneParamValue = searchParams?.get(edizioneParamName) ?? '';
    const ricercaParamValue = searchParams?.get(ricercaParamName) ?? '';
    const [searchInput, setSearchInput] = useState(ricercaParamValue);

    function handleSearch() {
        const params = new URLSearchParams();

        params.set(edizioneParamName, edizioneParamValue ?? listaTornei[0]?.id.toString() ?? '1');
        params.set(ricercaParamName, searchInput);

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
                    title={"Squadre"}
                    description={"Tutte le squadre iscritte alle varie edizioni del torneo, sia passate che attuali."}
                />
                <div className={"w-full mt-6"}>
                    <Field className="w-full min-w-full sm:min-w-96">
                        <ButtonGroup>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Cerca per nome squadra..."
                                aria-label="Cerca giocatore"
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                value={searchInput}
                            />
                            <TeamSearchFilters
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
                    className={"grid grid-cols-1 md:grid-cols-2 gap-5"}
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
                            <EmptyTitle className="flex items-center justify-center text-xl sm:text-2xl">
                                <XIcon className="me-1" /> Nessun risultato trovato
                            </EmptyTitle>
                            <EmptyDescription className="text-sm sm:text-base">
                                Prova a cambiare i filtri di ricerca
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="text-center text-zinc-500 mt-12">
                        Risultati totali: <b>{listaSquadre.length}</b>
                    </div>
                )}
            </div>
        </div>
    );
}