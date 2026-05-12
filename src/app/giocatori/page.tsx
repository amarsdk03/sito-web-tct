import Players from "@/features/giocatori/Players";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Cerca giocatori",
    "Cerca tra i giocatori iscritte nelle varie edizioni del torneo."
);

export default async function Page() {
    return (
        <Players />
    );
}