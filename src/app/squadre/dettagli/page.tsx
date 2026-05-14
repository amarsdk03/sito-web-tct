import TeamInfo from "@/features/squadre/TeamInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli squadra",
    "Visualizza i dati, la formazione e molto altro"
);

export default function Page() {
    return (
        <TeamInfo />
    );
}
