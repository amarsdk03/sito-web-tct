import TeamInfo from "@/features/squadre/TeamInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli squadra",
    "Visualizza le informazioni e le statistiche di una specifica squadra."
);

export default function Page() {
    return (
        <TeamInfo />
    );
}
