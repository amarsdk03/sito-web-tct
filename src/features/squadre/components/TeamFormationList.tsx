'use client';

import Link from "next/link";
import {memo, useMemo} from 'react';

import {Constants} from "@/types/database.types";
import {formazioneSquadraType} from "@/features/squadre/queries";

import PlayerSilhouette from "@/features/giocatori/components/PlayerSilhouette";
import {Badge} from "@/components/ui/badge";
import {calcolaRapportoContrasto} from "@/lib/utils";
import {DEFAULT_BACKGROUND_COLOR, DEFAULT_CONTRAST_RATIO, DEFAULT_FALLBACK_COLOR} from "@/const/defaultConstants";

interface TeamComponentsTableProps {
    showAsSilhouette?: boolean,
    showBadgeCapitani?: boolean,
    idCapitano?: number,
    stemmaSquadra: string | null,
    coloreSquadra: string,
    formazioneSquadra: formazioneSquadraType;
}

export const TeamFormationList = memo(
    function TeamFormationList(
        {
            showAsSilhouette = false,
            showBadgeCapitani = false,
            idCapitano,
            stemmaSquadra,
            coloreSquadra,
            formazioneSquadra
        }: TeamComponentsTableProps
    ) {
        // MEMOIZED: only recalculates when formazioneSquadra changes
        const normalizedFormation = useMemo(() =>
                formazioneSquadra.map(f => ({
                    ...f,
                    ruoloPrincipale: f.giocatore?.ruolo_principale ?? null,
                })),
            [formazioneSquadra]  // Dependency array
        );

        // MEMOIZED: only creates once (roles never change)
        const roles = useMemo(() => [
            ...Object.values(Constants.public.Enums.ruolo_giocatore),
            null
        ], []);

        const coloreLeggibile = calcolaRapportoContrasto(coloreSquadra, DEFAULT_BACKGROUND_COLOR) > DEFAULT_CONTRAST_RATIO
            ? coloreSquadra
            : DEFAULT_FALLBACK_COLOR;

        return roles.map((role) => {
            const playersWithRole = normalizedFormation.filter(
                f => f.giocatore?.ruolo_principale === role
            );

            if (playersWithRole.length === 0) return null;

            return (
                <div key={role} className={"mb-6"}>
                    <h3
                        className="integral-title font-semibold tracking-wide text-xl sm:text-3xl mb-4 sm:mb-6 -translate-x-0.75"
                        style={{color: coloreLeggibile}}
                    >
                        {role === null ? "Senza ruolo" : role.slice(0, -1) + "i"}
                    </h3>

                    {
                        playersWithRole.length > 0 ? (
                            <>
                                <div
                                    className="grid grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-x-6 auto-rows-fr"
                                    hidden={!showAsSilhouette}
                                >
                                    {playersWithRole.map((f) => {
                                        if (!f.giocatore) return null;

                                        return (
                                        <Link key={f.giocatore.id} href={"/giocatori/dettagli?id=" + f.giocatore.id}>
                                            <div className={"text-sm sm:text-lg lg:text-2xl font-medium bg-zinc-800 rounded-lg h-full flex flex-col"}>
                                                <div className={"relative min-w-32 sm:min-w-54 mx-0 overflow-hidden flex-1"}>
                                                    <div className="integral-title absolute top-0 w-full p-4 z-0">
                                                        <div className="flex justify-between items-start not-italic tracking-wider">
                                                            <div className={"flex flex-col items-start gap-0.5"}>
                                                                <span className={"text-xs"}>
                                                                    {f.giocatore.nome_maglia}
                                                                </span>
                                                                {
                                                                    (idCapitano === f.giocatore.id || f.giocatore.is_capitano) && (
                                                                        <span
                                                                            className={"text-[0.5em]"}
                                                                            style={{color: coloreSquadra}}
                                                                        >
                                                                            Capitano
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>
                                                            <span className={"-mt-0.75"}>
                                                                {f.giocatore.numero_maglia && "#" + f.giocatore.numero_maglia}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={"player-anim-hover flex justify-center"}>
                                                        <div className={`max-w-32 sm:max-w-54 pt-5 px-4 translate-y-5`}>
                                                            <PlayerSilhouette
                                                                teamColor={coloreSquadra}
                                                                teamBadge={stemmaSquadra || undefined}
                                                                playerImage={f.giocatore.link_foto}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={"text-lg/6 sm:text-xl font-semibold bg-zinc-800"}>
                                                    <div
                                                        style={{backgroundColor: (coloreSquadra + "59")}}
                                                        className="min-h-[70px] flex items-center justify-center"
                                                    >
                                                        <div className={"p-2 sm:py-4 text-center"}>
                                                            {f.giocatore.nome + " " + f.giocatore.cognome}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                </div>
                                <div hidden={showAsSilhouette}>
                                    {
                                        playersWithRole.map((f) => {
                                            if (!f.giocatore) return null;

                                            return (
                                                <div key={f.giocatore.id} className={"text-hover-translate text-md sm:text-2xl font-medium mb-2"}>
                                                    <Link href={"/giocatori/dettagli?id=" + f.giocatore.id}>
                                                        {
                                                            f.giocatore.nome + " " + f.giocatore.cognome
                                                        } {
                                                        ((idCapitano && idCapitano === f.giocatore.id || f.giocatore.is_capitano) && showBadgeCapitani) && (
                                                            <Badge variant="outline" className={"ms-1 text-xs sm:text-base py-3 -translate-y-0.5"}>
                                                                <b>Capt.</b>
                                                            </Badge>
                                                        )
                                                    }
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="text-stone-300 text-md">
                                Nessun giocatore con questo ruolo
                            </div>
                        )
                    }
                </div>
            );
        });
    }
)