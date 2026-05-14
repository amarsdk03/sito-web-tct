import Teams from "@/features/squadre/Teams";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Cerca squadra",
    "Lista tutte le squadre iscritte nelle varie edizioni"
);

export default function Page() {
    return (
        <Teams />
    );
}
