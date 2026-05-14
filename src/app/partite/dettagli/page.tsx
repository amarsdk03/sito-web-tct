import FixtureInfo from "@/features/partite/FixtureInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Visualizza dettagli partita"
);

export default function Page() {
    return (
        <FixtureInfo />
    );
}
