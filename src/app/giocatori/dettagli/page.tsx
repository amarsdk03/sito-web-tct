import PlayerInfo from "@/features/giocatori/PlayerInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Visualizza dettagli giocatore"
);

export default function Page() {
    return (
        <PlayerInfo />
    );
}
