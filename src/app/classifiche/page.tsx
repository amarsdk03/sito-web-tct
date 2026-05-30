import Link from "next/link";
import {Suspense} from "react";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {dynamicMetadata} from "@/server/metadata";

import {getListaCategorie, getListaPartite, listaCategorieType, listaPartiteType} from "@/server/data/fixtures";
import {categorieClassificaType, getCategorieClassifica, getListaTornei} from "@/server/data/rankings";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {Button} from "@/components/ui/button";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import Rankings from "@/features/tornei/Rankings";

type searchParamProps = {
    searchParams: Promise<{
        edizione?: string,
        categoria?: string,
        girone?: string,
    }>;
};

type paramProps = {
    idEdizione: string | null;
    idCategoria: string | null;
    nomeGirone: string | null;
}

/**
 * Generate dynamic metadata
 * This runs on the server and can access the URL parameters
 */
export async function generateMetadata(): Promise<Metadata> {
    return dynamicMetadata(
        "Classifiche",
        "Lista tutte le classifiche attuali e passate del torneo",
        `/classifiche`,
    );
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function RankingsServer({idEdizione, idCategoria, nomeGirone}: paramProps) {
    const edizioneParamName = 'edizione';
    const categoriaParamName = 'categoria';
    const gironeParamName = 'girone';

    let categorie: listaCategorieType[] = [];
    let partite: listaPartiteType[] = [];
    let categorieClassifica: categorieClassificaType = [];

    const tornei = await getListaTornei();
    const selectedTorneoId = idEdizione || tornei[0]?.id.toString() || "-1";

    try {
        const [listaCategorie, listaPartite, listaCategorieClassifica] = await Promise.all([
            getListaCategorie(),
            getListaPartite(Number.parseInt(selectedTorneoId), Number.parseInt(idCategoria || "-1"), nomeGirone),
            getCategorieClassifica(idCategoria ? Number.parseInt(idCategoria) : null, Number.parseInt(selectedTorneoId)),
        ]);

        categorie = listaCategorie;
        partite = listaPartite;
        categorieClassifica = listaCategorieClassifica;
    }
    // eslint-disable-next-line
    catch (error: any) {
        // Handles "range not satisfiable" error - reset to page 1
        if (error.code === 'PGRST103') {
            redirect(`/partite`);
        } else {
            return (
                <div className={"page-container"}>
                    <div className={"page-content my-48"}>
                        <ErrorInfo infoMessage={"Errore durante il recupero delle partite"} />
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
        <Rankings
            edizioneParamName={edizioneParamName}
            categoriaParamName={categoriaParamName}
            gironeParamName={gironeParamName}
            listaCategorie={categorie}
            listaPartite={partite}
            categorieClassifica={categorieClassifica}
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
    const idCategoria = params?.categoria || null;
    const nomeGirone = params?.girone || null;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <RankingsServer idEdizione={idEdizione} idCategoria={idCategoria} nomeGirone={nomeGirone} />
            </Suspense>
            <Footer/>
        </>
    );
}