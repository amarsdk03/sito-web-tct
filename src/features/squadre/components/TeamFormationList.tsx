import Link from "next/link";

import {playerRole, PlayerSearchData} from "@/types/player";
import { Badge } from "@/components/ui/badge";

interface TeamComponentsTableProps {
    squadColor: string,
    formation: PlayerSearchData[];
}

export default function TeamFormationList(
    { squadColor, formation }: TeamComponentsTableProps
) {
    const normalizedFormation = formation.map(player => ({
        ...player,
        ruoloPrincipale: player.ruoloPrincipale ?? playerRole.N
    }));

    return Object.values(playerRole)
        .filter(role =>
            role !== playerRole.N ||
            normalizedFormation.some(player => player.ruoloPrincipale === playerRole.N)
        )
        .map((role) => (
            <div key={role} className={"mb-6"}>
                <h3
                    className="integral-title font-semibold tracking-wide text-3xl mb-4 -translate-x-0.75"
                    style={{ color: (squadColor + "ee") }}
                >
                    {role === playerRole.N ? role : role.slice(0, -1) + "i"}
                </h3>

                {normalizedFormation
                    .filter(player => player.ruoloPrincipale === role)
                    .map((player, index) => (
                        <div key={index} className={"text-hover-translate text-2xl font-medium mb-2"}>
                            <Link href={"/giocatori/dettagli?id=" + player.id}>
                                {
                                    player.nome + " " + player.cognome
                                } { (player.isCapitano === true) && (
                                        <Badge variant="outline" className={"ms-1 text-base py-3 -translate-y-0.5"}>
                                            <b>Capitano</b>
                                        </Badge>
                                    )
                                }
                            </Link>
                        </div>
                    ))}

                {!normalizedFormation.some(player => player.ruoloPrincipale === role) && (
                    <div className="text-stone-300 text-md">
                        Nessun giocatore disponibile con questo ruolo
                    </div>
                )}
            </div>
        ));
}