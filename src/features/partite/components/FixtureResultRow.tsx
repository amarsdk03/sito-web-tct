import Link from "next/link";
import Image from "next/image";
import {listaPartiteType} from "@/server/data/fixtures";
import useIsMobile from "@/lib/isMobile";

interface FixtureResultRowProps {
    partita: listaPartiteType[number],
    halfSize?: boolean,
}

export default function FixtureResultRow(
    {
        partita,
        halfSize = false,
    } : FixtureResultRowProps
) {
    const isMobile = useIsMobile();

    const partitaFutura = new Date(partita.fischio_inizio) > new Date();

    const aiCalciDiRigore =
        (partita.rigori_casa && partita.rigori_casa > 0) ||
        (partita.rigori_ospite && partita.rigori_ospite > 0);

    const esitoRegolare = (partita.goal_casa || 0) + " - " + (partita.goal_ospite || 0);
    const esitoRigori = (partita.rigori_casa || 0) + " - " + (partita.rigori_ospite || 0);

    const nomeCasa = halfSize ? partita.squadra_casa_acronimo : partita.squadra_casa_nome;
    const nomeOspite = halfSize ? partita.squadra_ospite_acronimo : partita.squadra_ospite_nome;

    const giornoFischioInizio = partita.fischio_inizio ? new Date(partita.fischio_inizio).toLocaleDateString() : "TBD";
    const oraFischioInizio = partita.fischio_inizio ? new Date(partita.fischio_inizio).toLocaleTimeString().substring(0, 5) : "TBD";

    return (
        <Link href={`/partite/dettagli?id=${partita.id_partita}`}>
            <div className={"match-result-row flex flex-col lg:flex-row items-center justify-between bg-stone-600/50 p-4 sm:p-6 rounded-xl"}>
                <div className={"flex flex-row lg:flex-col justify-between text-start w-full lg:w-36"}>
                    <div className={"text-gray-300 sm:text-gray-100 text-xs sm:text-base font-bold"}>
                        { partita.fase || partita.giornata || "?" }
                    </div>

                    <div className={"text-gray-300 hidden lg:block"}>
                        { partita.categoria_nome }
                    </div>

                    <div className={"text-gray-300 sm:text-gray-100 text-xs sm:text-base font-bold block lg:hidden"}>
                        { giornoFischioInizio }
                    </div>
                </div>

                <div
                    className={`${halfSize && "lg:max-w-1/2 "}${isMobile ? "justify-around " : "justify-center "}match-info flex items-center py-2 sm:py-4 lg:py-0 w-full md:flex-1`}
                >
                    {
                        halfSize ? (
                            <div className="shrink-0 squad-result-badge flex items-center justify-center">
                                <Image
                                    src={partita.squadra_casa_stemma}
                                    alt="Stemma Squadra"
                                    width={40}
                                    height={40}
                                    className={`bg-none rounded-full object-cover`}
                                    draggable={false}
                                    loading={"lazy"}
                                />
                            </div>
                        ) : (
                            <span className={"w-full sm:w-64 py-0.5 text-right text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                                { nomeCasa ?? "???" }
                            </span>
                        )
                    }

                    <div className={"flex flex-col items-center justify-center w-auto shrink-0"}>
                        <span className={`integral-title text-xl ${partitaFutura ? 'sm:text-2xl text-stone-300' : 'sm:text-3xl text-chart-1 sm:-translate-y-0.75'} font-bold -translate-y-0.5`}>
                            { partitaFutura ? 'vs' : esitoRegolare }
                        </span>
                        {
                            aiCalciDiRigore === true && (
                                <span className={"integral-title text-xs sm:text-base text-gray-300"}>
                                    { esitoRigori + " D.C.R." }
                                </span>
                            )
                        }
                    </div>
                    {
                        halfSize ? (
                            <div className="shrink-0 squad-result-badge flex items-center justify-center">
                                <Image
                                    src={partita.squadra_ospite_stemma}
                                    alt="Stemma Squadra"
                                    width={40}
                                    height={40}
                                    className={`bg-none rounded-full object-cover`}
                                    draggable={false}
                                    loading={"lazy"}
                                />
                            </div>
                        ) : (
                            <span className={"w-full sm:w-64 py-0.5 text-left text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                                { nomeOspite ?? "???" }
                            </span>
                        )
                    }
                </div>

                <div className={"flex flex-row lg:flex-col justify-between text-end w-full lg:w-36"}>
                    <div className={"text-gray-200 text-xs sm:text-sm block lg:hidden"}>
                        { partita.categoria_nome }
                    </div>

                    <div className={"font-bold hidden lg:block"}>
                        { halfSize ? giornoFischioInizio.substring(0, 5) : giornoFischioInizio }
                    </div>

                    <div className={"text-gray-200 lg:text-gray-300 text-xs sm:text-sm"}>
                        { oraFischioInizio }
                    </div>
                </div>
            </div>
        </Link>
    )
}