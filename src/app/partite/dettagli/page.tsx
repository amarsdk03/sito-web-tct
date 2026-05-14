import FixtureInfo from "@/features/partite/FixtureInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Dettagli partita",
    "Visualizza il risultato, le statistiche e molto altro"
);

export default function Page() {
    return (
        <FixtureInfo />
    );
}
