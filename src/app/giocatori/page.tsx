import Link from "next/link";
import {Suspense} from "react";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {dynamicMetadata} from "@/server/metadata";

import {getListaTornei} from "@/server/data/rankings";
import {getListaGiocatori, listaGiocatoriType} from "@/server/data/players";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {Button} from "@/components/ui/button";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import Players from "@/features/giocatori/Players";

type searchParamProps = {
    searchParams: Promise<{
        edizione?: string,
        ricerca?: string,
        p?: string,
    }>;
};

type paramProps = {
    idEdizione: string | null;
    testoRicerca: string | null;
    numPagina: number;
}

/**
 * Generate dynamic metadata
 * This runs on the server and can access the URL parameters
 */
export async function generateMetadata(): Promise<Metadata> {
    return dynamicMetadata(
        "Cerca giocatori",
        "Lista tutti i giocatori iscritti alle varie edizioni",
        `/giocatori`,
    );
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function PlayersServer({idEdizione, testoRicerca, numPagina}: paramProps) {
    const edizioneParamName = 'edizione';
    const ricercaParamName = 'ricerca';
    const paginaParamName = 'p';
    const maxResultsPerPage = 20;

    let listaGiocatori: listaGiocatoriType[] = [];
    let countTotaleGiocatori = 0;

    const tornei = await getListaTornei();
    const selectedTorneoId = idEdizione || tornei[0]?.id.toString() || "-1";

    try {
        const giocatori = await getListaGiocatori(
            testoRicerca,
            Number.parseInt(selectedTorneoId),
            numPagina,
            maxResultsPerPage,
        );

        listaGiocatori = giocatori.result || [];
        countTotaleGiocatori = giocatori.count || 0;
    }
    // eslint-disable-next-line
    catch (error: any) {
        // Handles "range not satisfiable" error - reset to page 1
        if (error.code === 'PGRST103') {
            redirect(`/giocatori`);
        } else {
            return (
                <div className={"page-container"}>
                    <div className={"page-content my-48"}>
                        <ErrorInfo infoMessage={"Errore durante il recupero dei giocatori"} />
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
        <Players
            edizioneParamName={edizioneParamName}
            ricercaParamName={ricercaParamName}
            paginaParamName={paginaParamName}
            listaTornei={tornei}
            listaGiocatori={listaGiocatori}
            countTotaleGiocatori={countTotaleGiocatori}
            numPagina={numPagina}
            maxResultsPerPage={maxResultsPerPage}
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
    const numPagina = params?.p ? Number.parseInt(params.p) : 1;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <PlayersServer idEdizione={idEdizione} testoRicerca={testoRicerca} numPagina={numPagina} />
            </Suspense>
            <Footer/>
        </>
    );
}