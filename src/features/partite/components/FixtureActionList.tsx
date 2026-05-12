'use client';

import * as React from "react";
import {useMemo} from "react";
import {azioniPartitaType} from "@/features/partite/queries";

import {Progress as ProgressPrimitive} from "radix-ui";
import {string_to_snake_case} from "@/lib/utils";
import Image from "next/image";

interface GroupedActionsByType {
    [actionType: string]: {
        home: {
            teamName: string;
            players: Array<{
                playerName: string;
                playerId: number | null;
            }>;
        };
        away: {
            teamName: string;
            players: Array<{
                playerName: string;
                playerId: number | null;
            }>;
        };
    };
}

export function coloredProgressBar(progress: number, homeColor: string, awayColor: string) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={"relative flex h-3 w-full items-center overflow-x-hidden rounded-4xl bg-muted"}
            style={{ backgroundColor: awayColor }}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="size-full flex-1 bg-primary transition-all"
                style={{ transform: `translateX(-${100 - (progress || 0)}%)`, backgroundColor: homeColor }}
            />
        </ProgressPrimitive.Root>
    )
}

interface FixtureActionListProps {
    azioniPartita: azioniPartitaType;
    coloreSquadraCasa: string;
    coloreSquadraOspite: string;
}

export default function FixtureActionList(
    {
        azioniPartita,
        coloreSquadraCasa,
        coloreSquadraOspite,
    } : FixtureActionListProps
) {
    const groupedActions = useMemo(() => {
        const grouped: GroupedActionsByType = {};

        azioniPartita.forEach((azione) => {
            if (!azione.a_tipo) return;

            const isHomeTeam = azione.id_squadra_azione === azione.p_id_squadra_casa;
            const teamName = isHomeTeam
                ? azione.p_nome_squadra_casa
                : azione.p_nome_squadra_ospite;

            if (!teamName) return;

            // Initialize action type group if it doesn't exist
            if (!grouped[azione.a_tipo]) {
                grouped[azione.a_tipo] = {
                    home: {
                        teamName: azione.p_nome_squadra_casa || "Home",
                        players: []
                    },
                    away: {
                        teamName: azione.p_nome_squadra_ospite || "Away",
                        players: []
                    }
                };
            }

            const playerName = azione.p_nome && azione.p_cognome
                ? `${azione.p_nome} ${azione.p_cognome}`
                : "";

            if (isHomeTeam) {
                grouped[azione.a_tipo].home.players.push({
                    playerName,
                    playerId: azione.a_id_giocatore,
                });
            } else {
                grouped[azione.a_tipo].away.players.push({
                    playerName,
                    playerId: azione.a_id_giocatore,
                });
            }
        });

        return grouped;
    }, [azioniPartita]);

    const calculateProgress = (homeCount: number, awayCount: number): number => {
        const total = homeCount + awayCount;
        if (total === 0) return 50;
        return (homeCount / total) * 100;
    };

    return (
        <div className="w-full space-y-8">
            {Object.entries(groupedActions).map(([actionType, teamData]) => {
                const homeCount = teamData.home.players.length;
                const awayCount = teamData.away.players.length;
                const progressValue = calculateProgress(homeCount, awayCount);
                const iconPath = string_to_snake_case(actionType);

                return (
                    <div key={actionType} className="space-y-5">
                        <div className="flex items-center justify-between integral-title text-xl md:text-3xl font-bold text-mist-200">
                            <h3>
                                {homeCount}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Image
                                    src={`/icons/${iconPath}.png`}
                                    alt={"Goal"}
                                    width={25}
                                    height={25}
                                    className={"translate-y-0.5"}
                                />
                                <h3 className={"text-sm sm:text-xl md:text-2xl"}>
                                    {actionType}
                                </h3>
                            </div>
                            <h3>
                                {awayCount}
                            </h3>
                        </div>

                        { coloredProgressBar(progressValue, coloreSquadraCasa, coloreSquadraOspite) }

                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div className="space-y-1 text-start">
                                {
                                    homeCount > 0 && (
                                        teamData.home.players.map((player, idx) => (
                                            <div
                                                key={`home-${player.playerId}-${idx}`}
                                                className="text-xs md:text-sm text-mist-400 hover:text-mist-200 transition-colors"
                                            >

                                                {
                                                    player.playerName.length > 0 ? player.playerName : (
                                                        <i>Sconosciuto</i>
                                                    )
                                                }
                                            </div>
                                        ))
                                    )
                                }
                            </div>

                            <div className="space-y-1 text-end">
                                {
                                    awayCount > 0 && (
                                        teamData.away.players.map((player, idx) => (
                                            <div
                                                key={`away-${player.playerId}-${idx}`}
                                                className="text-xs md:text-sm text-mist-400 hover:text-mist-200 transition-colors"
                                            >
                                                {
                                                    player.playerName.length > 0 ? player.playerName : (
                                                        <i>Sconosciuto</i>
                                                    )
                                                }
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}