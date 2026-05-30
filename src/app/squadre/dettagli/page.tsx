import Link from "next/link";
import {Metadata} from "next";
import {Suspense} from "react";
import {dynamicMetadata} from "@/server/metadata";

import TeamInfo from "@/features/squadre/TeamInfo";
import {getDatiSquadra, getFormazioneSquadra, getStatisticheSquadra} from "@/server/data/teams";
import {getListaTornei} from "@/server/data/rankings";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ErrorInfo from "@/components/data-info/ErrorInfo";
import LoadingInfo from "@/components/data-info/LoadingInfo";
import {Button} from "@/components/ui/button";
import {getPartiteSquadra} from "@/server/data/fixtures";

type searchParamProps = {
    searchParams: Promise<{
        id?: string,
        edizione?: string,
    }>;
};

type paramProps = {
    id: string | null;
    edizione: string | null;
}

/**
 * Generate dynamic metadata with actual database data
 * This runs on the server and can access the URL parameters
 */
export async function generateMetadata(
    {searchParams}: searchParamProps
): Promise<Metadata> {
    const params = await searchParams;
    const idSquadra = Number.parseInt(params?.id ?? "-1");

    try {
        const datiSquadra = await getDatiSquadra(idSquadra);

        if (!datiSquadra?.id) {
            return dynamicMetadata(
                "Dettagli squadra",
                "Visualizza i dati, la formazione e molto altro",
                `/squadre`,
            );
        }

        // Build rich metadata with actual recovered data
        const title = `${datiSquadra.nome}`;
        const description = `${title}${datiSquadra.acronimo && (" | " + datiSquadra.acronimo)}`;
        const descriptionEnd = " - Sito web ufficiale del torneo di calcio della Città di Trento";

        return dynamicMetadata(
            title,
            description + descriptionEnd,
            `/squadre/dettagli${datiSquadra.id}`,
            datiSquadra.link_stemma ?? null,
        );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return dynamicMetadata(
            "Dettagli squadra",
            "Visualizza i dati, la formazione e molto altro",
            `/squadre`,
        );
    }
}

/**
 * Server component that handles data fetching
 * All queries are cached and run on the server
 */
async function TeamInfoServer({id, edizione}: paramProps) {
    const idParamName = 'id';
    const edizioneParamName = 'edizione';

    const idSquadra = Number.parseInt(id ?? "-1");
    const datiSquadra = await getDatiSquadra(idSquadra);

    const tornei = await getListaTornei();
    const selectedTorneoId = edizione || tornei[0]?.id.toString() || "-1";

    if (!datiSquadra?.id) return (
        <div className={"page-container"}>
            <div className={"page-content my-48"}>
                <ErrorInfo infoMessage={"Errore durante il recupero della squadra"} />
                <Link href="/" className={"w-full flex justify-center"}>
                    <Button variant="outline" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                        Torna alla Home
                    </Button>
                </Link>
            </div>
        </div>
    );

    const [
        partiteSquadra,
        statisticheSquadra,
        formazioneSquadra,
    ] = await Promise.all([
        getPartiteSquadra(idSquadra),
        getStatisticheSquadra(idSquadra),
        getFormazioneSquadra(idSquadra, Number.parseInt(selectedTorneoId)),
    ]);

    return (
        <TeamInfo
            idSquadra={idSquadra}
            idParamName={idParamName}
            edizioneParamName={edizioneParamName}
            datiSquadra={datiSquadra}
            listaTornei={tornei}
            partiteSquadra={partiteSquadra}
            datiStatisticheSquadra={statisticheSquadra}
            formazioneSquadra={formazioneSquadra}
        />
    );
}

/**
 * Actual page layout, including navbar and footer
 * Renders the content with Suspense for loading state
 */
export default async function Page({searchParams}: searchParamProps) {
    const params = await searchParams;

    const idSquadra = params?.id || null;
    const idEdizione = params?.edizione || null;

    return (
        <>
            <Navbar/>
            <Suspense fallback={
                <div className={"page-container my-48"}>
                    <LoadingInfo infoMessage={"Recupero in corso..."} />
                </div>
            }>
                <TeamInfoServer id={idSquadra} edizione={idEdizione} />
            </Suspense>
            <Footer/>
        </>
    );
}