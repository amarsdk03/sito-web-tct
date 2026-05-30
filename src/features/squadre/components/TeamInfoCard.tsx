import Link from "next/link";
import Image from "next/image";

import {listaSquadreContateType} from "@/app/squadre/page";

import {Card} from "@/components/ui/card";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

export default function TeamInfoCard({infoSquadra}: { infoSquadra: listaSquadreContateType }) {
    const linkStemma = infoSquadra.s_link_stemma ?? DEFAULT_LOGO_PATH;
    const coloreSquadra = infoSquadra.s_colore_squadra || "#222222";

    return (
        <Link href={`/squadre/dettagli?id=${infoSquadra.s_id}`}>
            <Card
                className={`squad-result-card h-full flex flex-row p-4 md:p-6`}
                style={{
                    background: `linear-gradient(145deg, ${coloreSquadra}e3 -100%, ${coloreSquadra}80 100%)`,
                }}
            >
                <div className="flex-shrink-0 squad-result-badge flex items-center justify-center">
                    <Image
                        src={linkStemma}
                        alt="Stemma Squadra"
                        width={80}
                        height={80}
                        className={`bg-none rounded-full object-cover`}
                        draggable={false}
                        loading={"lazy"}
                    />
                </div>
                <div className="squad-result-info flex flex-col justify-center my-0 sm:my-2">
                    <div className={"font-semibold text-md"}>
                        <span className={"not-italic text-gray-100"}>
                            {infoSquadra.s_acronimo}
                        </span>
                    </div>
                    <div className={"integral-title font-semibold text-xl sm:text-2xl wrap-anywhere"}>
                        <span className={"not-italic text-gray-100"}>
                            {infoSquadra.s_nome}
                        </span>
                    </div>
                    <div className={"font-semibold text-md mt-1"}>
                        <span className={"not-italic text-gray-100"}>
                            Giocatori registrati: {infoSquadra.n_giocatori}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}