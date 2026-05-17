'use client';

import {Suspense, useEffect, useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {
    categorieClassificaType,
    getCategorieClassifica,
    getListaTornei,
    listaTorneiType
} from "@/features/tornei/queries";
import {getListaCategorie, getListaPartite, listaCategorieType, listaPartiteType} from "@/features/partite/queries";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import LoadingInfo from "@/components/data-info/LoadingInfo";

import PageTitle from "@/components/text/PageTitle";
import TournamentSarchFilters from "@/features/tornei/components/RankingSearchFilters";

import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner"
import {Separator} from "@/components/ui/separator";
import {XIcon} from "lucide-react";
import WrongDataContact from "@/components/data-info/WrongDataContact";
import RankingTable from "@/features/tornei/components/RankingTable";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {calcolaClassifiche} from "@/lib/utils";

export default function Rankings() {
    return (
        <>
            <Navbar/>
            <Suspense fallback={<div className="flex justify-center p-32"><Spinner/></div>}>
                <RankingsContent />
            </Suspense>
            <Footer/>
        </>
    );
}

export function RankingsContent() {
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
    const [categorieClassifica, setCategorieClassifica] = useState<categorieClassificaType>();

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

                const [categorie, partite, categorieClassifica] = await Promise.all([
                    getListaCategorie(),
                    getListaPartite(selectedTorneoId, categoriaParam, gironeParam),
                    getCategorieClassifica(categoriaParam ? Number.parseInt(categoriaParam) : null, selectedTorneoId),
                ]);

                setListaCategorie(categorie);
                setListaPartite(partite);
                setCategorieClassifica(categorieClassifica);
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
                        .map(p => [p.torneo_id, {id: p.torneo_id!, nome: p.torneo_nome!}])
                ).values()
            ),
        [listaCategorie]
    );

    const categorie = useMemo(() =>
            Array.from(
                new Map(
                    listaCategorie
                        .filter(p => p.categoria_id && p.categoria_nome)
                        .map(p => [p.categoria_id, {id: p.categoria_id!.toString(), nome: p.categoria_nome!}])
                ).values()
            ),
        [listaCategorie]
    );

    const gironi = useMemo(() =>
            Array.from(
                new Set(listaCategorie.filter(p => p.girone).map(p => p.girone!))
            )
                .map(g => ({girone: g}))
                .sort((a, b) => a.girone.localeCompare(b.girone)),
        [listaCategorie]
    );

    const classifiche = useMemo(() => calcolaClassifiche(listaPartite), [listaPartite]);

    return (
        <div className={"page-container"}>
            <div className={"page-content mt-6 lg:mt-12"}>
                <PageTitle
                    title={"Classifiche"}
                    description={"Tutte le classifiche delle varie edizioni, attuali e passate, del torneo."}
                />
                <div className={"mt-8"}>
                    <TournamentSarchFilters
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

                <Separator className={"my-6"}/>

                {error ? (
                    <Empty className="w-full text-red-300">
                        <EmptyHeader>
                            <EmptyTitle className="flex items-center justify-center text-2xl">
                                <XIcon className="me-1"/> Errore sconosciuto
                            </EmptyTitle>
                            <EmptyDescription className="text-base">
                                Prova a ricaricare la pagina o resetta i filtri di ricerca
                            </EmptyDescription>
                            <EmptyContent className={"pt-4"}>
                                <Button variant="outline" onClick={() => router.push(pathname)}>
                                    Ricarica pagina
                                </Button>
                            </EmptyContent>
                        </EmptyHeader>
                    </Empty>
                ) : loading ? (
                    <div className={"mt-12"}>
                        <LoadingInfo infoMessage={"Recupero classifiche in corso..."}/>
                    </div>
                ) : Object.keys(classifiche).length === 0 ? (
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
                    <div className="space-y-16 sm:mt-8">
                        {
                            Object.entries(classifiche).map(([categoriaNome, gironi]) => (
                                <div key={categoriaNome} className="space-y-5">
                                    <h2 className="integral-title text-4xl font-semibold">
                                        {categoriaNome}
                                    </h2>

                                    {(() => {
                                        // Invertiamo l'ordine dei gironi (es. da ["A", "B"] a ["B", "A"])
                                        const gironiInvertiti = Object.entries(gironi).reverse();

                                        // Il defaultValue sarà la chiave del primo girone dell'elenco invertito
                                        const defaultGirone = gironiInvertiti[0]?.[0] ?? "";

                                        return (
                                            <Tabs defaultValue={defaultGirone}>
                                                <TabsList className="flex text-lg justify-start gap-2 px-1 py-5 mb-2">
                                                    {gironiInvertiti.map(([gironeNome]) => (
                                                        <TabsTrigger
                                                            key={gironeNome}
                                                            value={gironeNome}
                                                            className="px-4 py-4"
                                                        >
                                                            {gironeNome === "Unico" ? "Girone Unico" : `Girone ${gironeNome}`}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>

                                                {gironiInvertiti.map(([gironeNome, datiSquadre]) => (
                                                    <TabsContent
                                                        key={gironeNome}
                                                        value={gironeNome}
                                                    >
                                                        <RankingTable
                                                            datiSquadre={datiSquadre}
                                                            mostraClassifiche={gironeNome !== "Unico"}
                                                            mostraLeggenda={true}
                                                            numQualificate={categorieClassifica?.[0]?.num_qualificate}
                                                            numPlayoff={categorieClassifica?.[0]?.num_playoff}
                                                            numEliminate={categorieClassifica?.[0]?.num_eliminate}
                                                        />
                                                    </TabsContent>
                                                ))}
                                            </Tabs>
                                        );
                                    })()}
                                </div>
                            ))
                        }
                        <WrongDataContact/>
                    </div>
                )}
            </div>
        </div>
    );
}