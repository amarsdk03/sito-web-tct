import Link from "next/link";
import {Suspense} from "react";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {dynamicMetadata} from "@/server/metadata";

import Teams from "@/features/squadre/Teams";
import {getListaTornei} from "@/server/data/rankings";
import {getListaSquadre, listaSquadreType} from "@/server/data/teams";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {Button} from "@/components/ui/button";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import ErrorInfo from "@/components/data-info/ErrorInfo";

type searchParamProps = {
    searchParams: Promise<{
        edizione?: string,
        ricerca?: string,
    }>;
};

type paramProps = {
    idEdizione: string | null;
    testoRicerca: string | null;
}

export type listaSquadreContateType = listaSquadreType & { n_giocatori: number };

/**
 * Generate dynamic metadata
 * This runs on the server and can access the URL parameters
 */
export async function generateMetadata(): Promise<Metadata> {
    return dynamicMetadata(
        "Cerca squadra",
        "Lista tutte le squadre iscritte nelle varie edizioni",
        `/squadre`,
    );
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function TeamsServer({idEdizione, testoRicerca}: paramProps) {
    const edizioneParamName = 'edizione';
    const ricercaParamName = 'ricerca';

    let listaSquadre: listaSquadreContateType[] = [];
    const tornei = await getListaTornei();
    const selectedTorneoId = idEdizione || tornei[0]?.id.toString() || "-1";

    try {
        const squadre = await getListaSquadre(
            testoRicerca,
            Number.parseInt(selectedTorneoId)
        );

        // Raggruppo ogni iscrizione con la stessa squadra in un singolo risultato, sommando il numero di componenti
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

        listaSquadre = Array.from(squadreMap.values()) || [];
    }
    // eslint-disable-next-line
    catch (error: any) {
        // Handles "range not satisfiable" error - reset to page 1
        if (error.code === 'PGRST103') {
            redirect(`/squadre`);
        } else {
            return (
                <div className={"page-container"}>
                    <div className={"page-content my-48"}>
                        <ErrorInfo infoMessage={"Errore durante il recupero delle squadre"} />
                        <Link href="/" className={"w-full flex justify-center"}>
                            <Button variant="outline" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                                Torna alla Home
                            </Button>
                        </Link>
                    </div>
                </div>
            )
        }
    }

    return (
        <Teams
            edizioneParamName={edizioneParamName}
            ricercaParamName={ricercaParamName}
            listaTornei={tornei}
            listaSquadre={listaSquadre}
        />
    );
}

/**
 * Actual page layout, including navbar and footer
 * Renders the content with Suspense for loading state
 */
export default async function Page({searchParams}: searchParamProps) {
    const params = await searchParams;

    const idEdizione = params?.edizione || null;
    const testoRicerca = params?.ricerca || null;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <TeamsServer idEdizione={idEdizione} testoRicerca={testoRicerca} />
            </Suspense>
            <Footer/>
        </>
    );
}