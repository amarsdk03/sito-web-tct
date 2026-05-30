import {useEffect, useMemo, useState} from "react";

import {getListaPartite, listaPartiteType} from "@/server/data/fixtures";
import {categorieClassificaType, getCategorieClassifica, getListaTornei} from "@/server/data/rankings";
import {calcolaClassifiche} from "@/lib/utils";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import RankingTable from "@/features/tornei/components/RankingTable";
import LoadingInfo from "@/components/data-info/LoadingInfo";

export default function CurrentRankingsTables() {
    const [listaPartite, setListaPartite] = useState<listaPartiteType>([]);
    const [categorieClassifica, setCategorieClassifica] = useState<categorieClassificaType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);

            try {
                const tornei = await getListaTornei();

                if (!tornei) {
                    setLoading(false);
                    return;
                }

                const ultimoTorneo = tornei[0].id;
                const [partite, categorieClassifica] = await Promise.all([
                    getListaPartite(ultimoTorneo, null, null),
                    getCategorieClassifica(null, ultimoTorneo),
                ]);

                setCategorieClassifica(categorieClassifica);
                setListaPartite(partite);
            }
            // eslint-disable-next-line
            catch (error: any) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const classifiche = useMemo(() => calcolaClassifiche(listaPartite), [listaPartite]);

    if (loading) {
        return (
            <div className={"my-5"}>
                <LoadingInfo infoMessage={"Recupero in corso..."} />
            </div>
        )
    }

    if (error || listaPartite.length === 0) {
        return (
            <div className={"my-8 px-4"}>
                <p className="text-base sm:text-xl text-center font-medium italic text-mist-300">
                    Nessun prossimo incontro attualmente fissato
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8 mt-4">
            {
                Object.entries(classifiche).map(([categoriaNome, gironi]) => (
                    <div key={categoriaNome}>
                        {(() => {
                            const objectGironi = Object.entries(gironi).sort(([a], [b]) =>
                                a.localeCompare(b)
                            );
                            const defaultGirone = objectGironi[0]?.[0] ?? "";

                            return (
                                <Tabs defaultValue={defaultGirone}>
                                    <div className="flex justify-between items-center gap-y-2">
                                        <h2 className="integral-title text-md sm:text-xl font-semibold">
                                            {categoriaNome}
                                        </h2>
                                        <TabsList>
                                            {objectGironi.map(([gironeNome]) => (
                                                <TabsTrigger
                                                    key={gironeNome}
                                                    value={gironeNome}
                                                >
                                                    <span className={"hidden sm:block"}>
                                                        Girone
                                                    </span>
                                                    <span className={"px-2 sm:px-0"}>
                                                        { gironeNome || "???"}
                                                    </span>
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>

                                    {objectGironi.map(([gironeNome, datiSquadre]) => (
                                        <TabsContent
                                            key={gironeNome}
                                            value={gironeNome}
                                        >
                                            <RankingTable
                                                datiSquadre={datiSquadre}
                                                mostraClassifiche={gironeNome !== "Unico"}
                                                mostraLeggenda={false}
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
        </div>
    )
}