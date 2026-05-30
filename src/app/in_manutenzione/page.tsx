import UnderMaintainance from "@/components/redirects/UnderMaintainance";

import {Metadata} from "next";
import {dynamicMetadata} from "@/server/metadata";

export const metadata: Metadata = dynamicMetadata(
    "In manutenzione",
    "Sito web temporaneamente in manutenzione. Riprova tra qualche minuto"
);

export default function Page() {
    return (
        <UnderMaintainance />
    );
}
