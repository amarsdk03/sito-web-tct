import Link from "next/link";
import {listaPartiteType} from "@/server/data/fixtures";

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
    const aiCalciDiRigore =
        (partita.rigori_casa && partita.rigori_casa > 0) ||
        (partita.rigori_ospite && partita.rigori_ospite > 0);

    const esitoRegolare = (partita.goal_casa || 0) + " - " + (partita.goal_ospite || 0);
    const esitoRigori = (partita.rigori_casa || 0) + " - " + (partita.rigori_ospite || 0);

    const nomeCasa = halfSize ? partita.squadra_casa_acronimo : partita.squadra_casa_nome;
    const nomeOspite = halfSize ? partita.squadra_ospite_acronimo : partita.squadra_ospite_nome;

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
                        { partita.fischio_inizio ? new Date(partita.fischio_inizio).toLocaleDateString() : "TBD" }
                    </div>
                </div>

                <div
                    className={`${halfSize ? "lg:max-w-1/2 " : ""}match-info flex items-center justify-center py-2 sm:py-4 lg:py-0 w-full md:flex-1`}
                >
                    <span className={"w-full sm:w-64 py-0.5 text-right text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                        { nomeCasa ?? "???" }
                    </span>

                    <div className={"flex flex-col items-center justify-center w-auto flex-shrink-0"}>
                        <span className={"integral-title text-xl sm:text-3xl text-chart-1 font-bold -translate-y-0.5 sm:-translate-y-0.75"}>
                            { esitoRegolare }
                        </span>
                        {
                            aiCalciDiRigore === true && (
                                <span className={"integral-title text-xs sm:text-base text-gray-300"}>
                                    { esitoRigori + " D.C.R." }
                                </span>
                            )
                        }
                    </div>

                    <span className={"w-full sm:w-64 py-0.5 text-left text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                        { nomeOspite ?? "???" }
                    </span>
                </div>

                <div className={"flex flex-row lg:flex-col justify-between text-end w-full lg:w-36"}>
                    <div className={"text-gray-200 text-xs sm:text-sm block lg:hidden"}>
                        { partita.categoria_nome }
                    </div>

                    <div className={"font-bold hidden lg:block"}>
                        { partita.fischio_inizio ? new Date(partita.fischio_inizio).toLocaleDateString() : "TBD" }
                    </div>

                    <div className={"text-gray-200 lg:text-gray-300 text-xs sm:text-sm"}>
                        { partita.fischio_inizio ? new Date(partita.fischio_inizio).toLocaleTimeString().substring(0, 5) : "TBD" }
                    </div>
                </div>
            </div>
        </Link>
    )
}