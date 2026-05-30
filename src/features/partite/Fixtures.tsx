'use client';

import {useMemo} from "react";
import {usePathname} from "next/navigation";
import {AnimatePresence, motion} from 'framer-motion';
import {listaCategorieType, listaPartiteType} from "@/server/data/fixtures";

import PageTitle from "@/components/text/PageTitle";
import FixtureResultRow from "@/features/partite/components/FixtureResultRow";
import CategorySearchFilters from "@/components/search/CategorySearchFilters";

import {Empty, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty";
import {Separator} from "@/components/ui/separator";
import {XIcon} from "lucide-react";
import WrongDataContact from "@/components/data-info/WrongDataContact";

interface FixturesProps {
    edizioneParamName: string;
    categoriaParamName: string;
    gironeParamName: string;
    listaCategorie: listaCategorieType;
    listaPartite: listaPartiteType;
}

export default function Fixtures(props: FixturesProps) {
    const pathname = usePathname();

    const {
        edizioneParamName = 'edizione',
        categoriaParamName = 'categoria',
        gironeParamName = 'girone',
        listaCategorie = [],
        listaPartite = [],
    } = props;

    const edizioni = useMemo(() =>
            Array.from(
                new Map(
                    listaCategorie
                        .filter(p => p.torneo_id && p.torneo_nome)
                        .map(p => [p.torneo_id, { id: p.torneo_id!, nome: p.torneo_nome! }])
                ).values()
            ),
        [listaCategorie]
    );

    const categorie = useMemo(() =>
            Array.from(
                new Map(
                    listaCategorie
                        .filter(p => p.categoria_id && p.categoria_nome)
                        .map(p => [p.categoria_id, { id: p.categoria_id!.toString(), nome: p.categoria_nome! }])
                ).values()
            ),
        [listaCategorie]
    );

    const gironi = useMemo(() =>
            Array.from(
                new Set(listaCategorie.filter(p => p.girone).map(p => p.girone!))
            )
                .map(g => ({ girone: g }))
                .sort((a, b) => a.girone.localeCompare(b.girone)),
        [listaCategorie]
    );

    const containerAnim = {
        start: { opacity: 0 },
        finish: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemAnim = {
        start: { opacity: 0, y: -10 },
        finish: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className={"page-container"}>
            <div className={"page-content mt-6 lg:mt-12"}>
                <PageTitle
                    title={"Partite"}
                    description={"Tutti i risultati e gli incontri in live e in arrivo, filtrabili in base all'edizione, alla categoria e al girone."}
                />
                <div className={"mt-8"}>
                    <CategorySearchFilters
                        pathname={pathname}
                        edizioneParamName={edizioneParamName}
                        categoriaParamName={categoriaParamName}
                        gironeParamName={gironeParamName}
                        edizioni={edizioni}
                        categorie={categorie}
                        gironi={gironi}
                    />
                </div>

                <Separator className={"my-6"} />

                <motion.div
                    variants={containerAnim}
                    initial={"start"}
                    animate={"finish"}
                    className={"space-y-4"}
                >
                    <AnimatePresence>
                        {listaPartite.map((partita) => (
                            <motion.div
                                key={partita.id_partita}
                                variants={itemAnim}
                            >
                                <FixtureResultRow partita={partita} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {listaPartite.length === 0 && (
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
                )}

                <WrongDataContact />
            </div>
        </div>
    );
}