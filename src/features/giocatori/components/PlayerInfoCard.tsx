import Link from "next/link";
import Image from "next/image";

import {listaGiocatoriType} from "@/server/data/players";

import {Card} from "@/components/ui/card";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

export default function PlayerInfoCard({infoGiocatore}: { infoGiocatore: listaGiocatoriType }) {
    const idGiocatore = infoGiocatore.g_id;
    const nominativo = infoGiocatore.g_nome + " " + infoGiocatore.g_cognome;
    const ruolo = infoGiocatore.g_ruolo_principale;

    const nomeSquadra = infoGiocatore.s_nome;
    const linkBadgeSquadra = infoGiocatore.s_link_stemma ?? DEFAULT_LOGO_PATH;
    const coloreSfondoCard = infoGiocatore.s_colore_squadra || "#222222";

    return (
        <Link href={`/giocatori/dettagli?id=${idGiocatore}`}>
            <Card className={`h-full flex flex-row p-4 md:px-6`}
                  style={{
                      background: `linear-gradient(145deg, ${coloreSfondoCard}70 0%, ${coloreSfondoCard}e3 100%)`,
                  }}
            >
                <div className="flex-shrink-0 squad-result-badge flex items-center justify-center">
                    <Image
                        src={linkBadgeSquadra}
                        alt="Badge squadra"
                        width={75}
                        height={75}
                        className={`squad-result-card-img bg-none rounded-full`}
                        draggable={false}
                        loading={"lazy"}
                    />
                </div>
                <div className="squad-result-info flex flex-col justify-center my-0 sm:my-2">
                    <div className={"font-semibold text-md"}>
                        <span className={"not-italic text-zinc-100"}>
                            { nomeSquadra || <span className={"italic text-zinc-400"}>Attualmente svincolato</span> }
                        </span>
                    </div>
                    <div className={"integral-title font-semibold text-2xl/7 py-2"}>
                        <span className={"not-italic text-zinc-100"}>
                            { nominativo }
                        </span>
                    </div>
                    <div className={"font-semibold text-md mt-1"}>
                        <span className={"not-italic text-zinc-100"}>
                            { ruolo || <span className={"italic text-zinc-300"}>Ruolo non specificato</span> }
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}