import Players from "@/features/giocatori/Players";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Cerca giocatori",
    "Lista tutti i giocatori iscritti alle varie edizioni"
);

export default async function Page() {
    return (
        <Players />
    );
}