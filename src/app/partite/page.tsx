import Fixtures from "@/features/partite/Fixtures";

import {Metadata} from "next";
import {dynamicMetadata} from "@/lib/metadata";

export const metadata: Metadata = dynamicMetadata(
    "Cerca partite",
    "Lista tutte le partite disputate nelle varie edizioni"
);

export default function Page() {
    return (
        <Fixtures />
    );
}
