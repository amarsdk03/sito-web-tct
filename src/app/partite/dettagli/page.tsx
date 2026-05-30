import Link from "next/link";
import {Metadata} from "next";
import {Suspense} from "react";
import {dynamicMetadata} from "@/server/metadata";

import {
    getAzioniPartita,
    getContentPartita,
    getDatiCampo,
    getDatiPartita,
    getListaPartite
} from "@/server/data/fixtures";
import FixtureInfo from "@/features/partite/FixtureInfo";
import {getFormazioneSquadra} from "@/server/data/teams";
import {getCategorieClassifica} from "@/server/data/rankings";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import {Button} from "@/components/ui/button";

type searchParamProps = {
    searchParams: Promise<{ id?: string }>;
};

type paramProps = {
    id: string | null;
}

/**
 * Generate dynamic metadata with actual database data
 * This runs on the server and can access the URL parameters
 */
export async function generateMetadata(
    {searchParams}: searchParamProps
): Promise<Metadata> {
    const params = await searchParams;
    const idPartita = Number.parseInt(params?.id ?? "-1");

    try {
        const datiPartita = await getDatiPartita(idPartita);

        if (!datiPartita?.id_partita) {
            return dynamicMetadata(
                "Dettagli partita",
                "Visualizza il risultato, le statistiche e molto altro",
                `/partite`,
            );
        }

        // Build rich metadata with actual recovered data
        const title = `${datiPartita.squadra_casa_nome} vs ${datiPartita.squadra_ospite_nome}`;
        const description = `${title} | ${datiPartita.categoria_nome || ""} | ${datiPartita.torneo_nome || ""}`;
        const descriptionEnd = " - Sito web ufficiale del torneo di calcio della Città di Trento";

        return dynamicMetadata(
            title,
            description + descriptionEnd,
            `/partite/dettagli${datiPartita.id}`,
        );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return dynamicMetadata(
            "Dettagli partita",
            "Visualizza il risultato, le statistiche e molto altro",
            `/partite`,
        );
    }
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function FixtureInfoServer({id}: paramProps) {
    const idPartita = Number.parseInt(id ?? "-1");
    const datiPartita = await getDatiPartita(idPartita);

    if (!datiPartita?.id_partita) return (
        <div className={"page-container"}>
            <div className={"page-content my-48"}>
                <ErrorInfo infoMessage={"Errore durante il recupero della partita"} />
                <Link href="/" className={"w-full flex justify-center"}>
                    <Button variant="outline" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                        Torna alla Home
                    </Button>
                </Link>
            </div>
        </div>
    );

    const idTorneo = datiPartita.torneo_id || -1;
    const idCategoria = datiPartita.categoria_id || -1;
    const valGirone = datiPartita.girone || "?";
    const idSquadraCasa = datiPartita.squadra_casa_id || -1;
    const idSquadraOspite = datiPartita.squadra_ospite_id || -1;
    const idCampo = datiPartita.campo_svolgimento || -1;

    const [
        azioniPartita,
        formazioneCasa,
        formazioneOspite,
        listaPartite,
        categorieClassifica,
        contentPartita,
        datiCampo,
    ] = await Promise.all([
        getAzioniPartita(idPartita),
        getFormazioneSquadra(idSquadraCasa, idTorneo),
        getFormazioneSquadra(idSquadraOspite, idTorneo),

        getListaPartite(
            idTorneo,
            idCategoria.toString(),
            valGirone
        ),

        getCategorieClassifica(idCategoria, idTorneo),
        getContentPartita(idPartita),
        getDatiCampo(idCampo),
    ]);

    return (
        <FixtureInfo
            idPartita={idPartita}
            datiPartita={datiPartita}
            azioniPartita={azioniPartita}
            formazioneCasa={formazioneCasa}
            formazioneOspite={formazioneOspite}
            listaPartite={listaPartite}
            categorieClassifica={categorieClassifica}
            contentPartita={contentPartita}
            datiCampo={datiCampo}
        />
    );
}

/**
 * Actual page layout, including navbar and footer
 * Renders the content with Suspense for loading state
 */
export default async function Page({searchParams}: searchParamProps) {
    const params = await searchParams;
    const idPartita = params?.id || null;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <FixtureInfoServer id={idPartita} />
            </Suspense>
            <Footer/>
        </>
    );
}