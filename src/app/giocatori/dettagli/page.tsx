import PlayerInfo from "@/features/giocatori/PlayerInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli giocatore",
    "Visualizza le informazioni e le statistiche di un specifico giocatore."
);

export default function Page() {
    return (
        <PlayerInfo />
    );
}
