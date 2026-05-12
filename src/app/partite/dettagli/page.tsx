import FixtureInfo from "@/features/partite/FixtureInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli partita",
    "Visualizza le informazioni e le statistiche di una specifica partita."
);

export default function Page() {
    return (
        <FixtureInfo />
    );
}
