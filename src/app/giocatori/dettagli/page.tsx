import Link from "next/link";
import {Metadata} from "next";
import {Suspense} from "react";
import {dynamicMetadata} from "@/server/metadata";

import PlayerInfo from "@/features/giocatori/PlayerInfo";
import {getDatiGiocatore, getStatisticheGiocatore} from "@/server/data/players";
import {getDatiSquadra, getFormazioneSquadra, getIdSquadraGiocatore} from "@/server/data/teams";
import {getListaTornei} from "@/server/data/rankings";

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
    const idGiocatore = Number.parseInt(params?.id ?? "-1");

    try {
        const datiGiocatore = await getDatiGiocatore(idGiocatore);

        if (!datiGiocatore?.id) {
            return dynamicMetadata(
                "Dettagli giocatore",
                "Visualizza i dati, le statistiche e molto altro",
                `/giocatori`,
            );
        }

        // Build rich metadata with actual recovered data
        const title = `${datiGiocatore.nome} ${datiGiocatore.cognome}`;
        const description = `${title}${datiGiocatore.ruolo_principale && (" | " + datiGiocatore.ruolo_principale)}`;
        const descriptionEnd = " - Sito web ufficiale del torneo di calcio della Città di Trento";

        return dynamicMetadata(
            title,
            description + descriptionEnd,
            `/giocatori/dettagli${datiGiocatore.id}`,
            datiGiocatore.link_foto ?? null,
        );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return dynamicMetadata(
            "Dettagli giocatore",
            "Visualizza i dati, le statistiche e molto altro",
            `/giocatori`,
        );
    }
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function PlayerInfoServer({id}: paramProps) {
    const idGiocatore = Number.parseInt(id ?? "-1");
    const datiGiocatore = await getDatiGiocatore(idGiocatore);

    if (!datiGiocatore?.id) return (
        <div className={"page-container"}>
            <div className={"page-content my-48"}>
                <ErrorInfo infoMessage={"Errore durante il recupero del giocatore"} />
                <Link href="/" className={"w-full flex justify-center"}>
                    <Button variant="outline" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                        Torna alla Home
                    </Button>
                </Link>
            </div>
        </div>
    );

    const [idSquadraGiocatore, statisticheGiocatore, tornei] = await Promise.all([
        getIdSquadraGiocatore(idGiocatore),
        getStatisticheGiocatore(idGiocatore),
        getListaTornei()
    ]);

    const idSquadra = idSquadraGiocatore?.id_squadra || -1;
    const idUltimoTorneo = tornei[0]?.id || -1;

    const [datiSquadraGiocatore, formazioneSquadraGiocatore] = await Promise.all([
        getDatiSquadra(idSquadra),
        getFormazioneSquadra(idSquadra, idUltimoTorneo)
    ]);

    // Salvo la formazione dell'ultimo torneo, ad esclusione del profilo del giocatore stesso
    const filteredFormazioneSquadra = formazioneSquadraGiocatore.filter(
        p => p.giocatore.id !== idGiocatore
    );

    return (
        <PlayerInfo
            idGiocatore={idGiocatore}
            datiGiocatore={datiGiocatore}
            statistiche={statisticheGiocatore ?? undefined}
            datiSquadra={datiSquadraGiocatore ?? undefined}
            formazioneSquadra={filteredFormazioneSquadra ?? undefined}
        />
    );
}

/**
 * Actual page layout, including navbar and footer
 * Renders the content with Suspense for loading state
 */
export default async function Page({searchParams}: searchParamProps) {
    const params = await searchParams;
    const idGiocatore = params?.id || null;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <PlayerInfoServer id={idGiocatore} />
            </Suspense>
            <Footer/>
        </>
    );
}