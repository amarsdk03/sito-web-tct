import TeamInfo from "@/features/squadre/TeamInfo";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Visualizza dettagli squadra"
);

export default function Page() {
    return (
        <TeamInfo />
    );
}
