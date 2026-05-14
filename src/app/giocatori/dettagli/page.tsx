import PlayerInfo from "@/features/giocatori/PlayerInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli giocatore",
    "Visualizza i dati, le statistiche e molto altro"
);

export default function Page() {
    return (
        <PlayerInfo />
    );
}
