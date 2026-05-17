import Rankings from "@/features/tornei/Rankings";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Classifiche",
    "Lista tutte le classifiche attuali e passate del torneo"
);

export default async function Page() {
    return (
        <Rankings />
    );
}