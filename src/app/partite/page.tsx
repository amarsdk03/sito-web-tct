import Fixtures from "@/features/partite/Fixtures";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Cerca partite",
    "Cerca le partite disputate nelle varie edizioni del torneo."
);

export default function Page() {
    return (
        <Fixtures />
    );
}
