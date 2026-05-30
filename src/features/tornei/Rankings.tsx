'use client';

import {useMemo} from "react";
import {usePathname} from "next/navigation";

import PageTitle from "@/components/text/PageTitle";
import CategorySearchFilters from "@/components/search/CategorySearchFilters";
import {listaCategorieType, listaPartiteType} from "@/server/data/fixtures";
import {categorieClassificaType} from "@/server/data/rankings";
import {calcolaClassifiche} from "@/lib/utils";

import {XIcon} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import {Separator} from "@/components/ui/separator";
import RankingTable from "@/features/tornei/components/RankingTable";
import WrongDataContact from "@/components/data-info/WrongDataContact";

interface Rankings {
    edizioneParamName: string;
    categoriaParamName: string;
    gironeParamName: string;
    listaCategorie: listaCategorieType;
    listaPartite: listaPartiteType;
    categorieClassifica: categorieClassificaType;
}

export default function Rankings(props: Rankings) {
    const pathname = usePathname();

    const {
        edizioneParamName = 'edizione',
        categoriaParamName = 'categoria',
        gironeParamName = 'girone',
        listaCategorie = [],
        listaPartite = [],
        categorieClassifica = []
    } = props;

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

                <Separator className={"my-6"}/>

                {Object.keys(classifiche).length === 0 ? (
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
                                        const objectGironi = Object.entries(gironi).sort(([a], [b]) =>
                                            a.localeCompare(b)
                                        );
                                        const defaultGirone = objectGironi[0]?.[0] ?? "";

                                        return (
                                            <Tabs defaultValue={defaultGirone}>
                                                <TabsList className="flex text-lg justify-start gap-2 px-1 py-5 mb-2">
                                                    {objectGironi.map(([gironeNome]) => (
                                                        <TabsTrigger
                                                            key={gironeNome}
                                                            value={gironeNome}
                                                            className="px-4 py-4"
                                                        >
                                                            Girone { gironeNome || "???"}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>

                                                {objectGironi.map(([gironeNome, datiSquadre]) => (
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