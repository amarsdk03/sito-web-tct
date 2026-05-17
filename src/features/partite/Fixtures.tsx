'use client';

import {Suspense, useEffect, useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from 'framer-motion';
import {getListaTornei, listaTorneiType} from "@/features/tornei/queries";
import {getListaCategorie, getListaPartite, listaCategorieType, listaPartiteType} from "@/features/partite/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import LoadingInfo from "@/components/data-info/LoadingInfo";

import PageTitle from "@/components/text/PageTitle";
import FixtureResultRow from "@/features/partite/components/FixtureResultRow";
import FixtureSearchFilters from "@/features/partite/components/FixtureSearchFilters";

import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner"
import {Separator} from "@/components/ui/separator";
import {XIcon} from "lucide-react";
import WrongDataContact from "@/components/data-info/WrongDataContact";

export default function Fixtures() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner /></div>}>
                <FixturesContent />
            </Suspense>
            <Footer />
        </>
    );
}

export function FixturesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const torneoParamName = 'edizione';
    const categoriaParamName = 'categoria';
    const gironeParamName = 'girone';

    const torneoParam = searchParams?.get(torneoParamName) ?? null;
    const categoriaParam = searchParams?.get(categoriaParamName) ?? null;
    const gironeParam = searchParams?.get(gironeParamName) ?? null;

    const [listaTornei, setListaTornei] = useState<listaTorneiType>([]);
    const [listaPartite, setListaPartite] = useState<listaPartiteType>([]);
    const [listaCategorie, setListaCategorie] = useState<listaCategorieType>([]);

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

                const [categorie, partite] = await Promise.all([
                    getListaCategorie(),
                    getListaPartite(selectedTorneoId, categoriaParam, gironeParam)
                ]);

                setListaCategorie(categorie)
                setListaPartite(partite);
            }
            // eslint-disable-next-line
            catch (error: any) {
                if (error.code === 'PGRST103') {
                    const params = new URLSearchParams();

                    params.set(torneoParamName, torneoParam?.toString() ?? listaTornei[0]?.id.toString() ?? '1');
                    params.set(categoriaParamName, categoriaParam ?? '');
                    params.set(gironeParamName, gironeParam ?? '');

                    router.push(`${pathname}?${params.toString()}`);
                } else {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [categoriaParam, gironeParam, listaTornei, pathname, router, torneoParam]);

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
                    <FixtureSearchFilters
                        loading={loading}
                        pathname={pathname}
                        torneoParamName={torneoParamName}
                        categoriaParamName={categoriaParamName}
                        gironeParamName={gironeParamName}
                        edizioni={edizioni}
                        categorie={categorie}
                        gironi={gironi}
                    />
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
                    <div className={"mt-12"}>
                        <LoadingInfo infoMessage={"Ricerca in corso..."} />
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={containerAnim}
                            initial={"start"}
                            animate={"finish"}
                        >
                            <AnimatePresence>
                                {
                                    listaPartite.map((partita) => (
                                        <motion.div
                                            key={partita.id_partita}
                                            variants={itemAnim}
                                        >
                                            <FixtureResultRow partita={partita} />
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        </motion.div>

                        {
                            listaPartite.length === 0 && (
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
                            )
                        }

                        <WrongDataContact />
                    </>
                )}

            </div>
        </div>
    );
}