import {useEffect, useState} from "react";

import {getListaTornei} from "@/server/data/rankings";
import {getProssimiIncontri, prossimiIncontriType} from "@/server/data/fixtures";
import FixtureResultRow from "@/features/partite/components/FixtureResultRow";

import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import LoadingInfo from "@/components/data-info/LoadingInfo";

export default function NextFixturesCarousel() {
    const [listaPartite, setListaPartite] = useState<prossimiIncontriType>([]);
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
                const dataOggi = new Date();
                dataOggi.setHours(0, 0, 0, 0);

                const partite = await getProssimiIncontri(ultimoTorneo, dataOggi);
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
        <Carousel className="w-full">
            <CarouselContent>
                {
                    listaPartite.map((partita) => (
                        <CarouselItem key={partita.id_partita} className={"sm:basis-1/2"}>
                            <FixtureResultRow partita={partita} halfSize={true} />
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}