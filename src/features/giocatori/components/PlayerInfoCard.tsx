import Link from "next/link";
import Image from "next/image";
import {SquadraDTO} from "@/types/squadra";

import {
    Card,
} from "@/components/ui/card";

export default function PlayerInfoCard({squadra}: { squadra: SquadraDTO }) {
    const linkBadge = squadra.logo ?? "/logo_eagle_only.png";
    const coloreSquadra = squadra.colore || "#222222";

    return (
        <Link href={`/giocatori/dettagli?id=${squadra.id}`}>
            <Card className={`squad-result-card flex flex-row p-4 md:p-6`}
                  style={{
                      background: `linear-gradient(145deg, ${coloreSquadra}70 0%, ${coloreSquadra}e3 100%)`,
                  }}
            >
                <div className="flex-shrink-0 squad-result-badge flex items-center justify-center">
                    <Image
                        src={linkBadge}
                        alt="Card image cover"
                        width={80}
                        height={80}
                        className={`squad-result-card-img bg-none rounded-full`}
                        draggable={false}
                        loading={"lazy"}
                    />
                </div>
                <div className="squad-result-info flex flex-col justify-center my-0 sm:my-2">
                    <div className={"font-semibold text-md"}>
                        <span className={"not-italic text-gray-100"}>
                            {squadra.nome}
                        </span>
                    </div>
                    <div className={"integral-title font-semibold text-2xl"}>
                        <span className={"not-italic text-gray-100"}>
                            {"Simone Del Dot"}
                        </span>
                    </div>
                    <div className={"font-semibold text-md mt-1"}>
                        <span className={"not-italic text-gray-100"}>
                            Attaccante
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}