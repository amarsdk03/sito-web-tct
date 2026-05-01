import Link from "next/link";
import { PartitaDTO } from "@/types/partita";

export default function MatchResultRow({partita}: { partita: PartitaDTO }) {
    return (
        <Link href={`/partite/dettagli?id=${partita.id}`}>
            <div className={"match-result-row flex flex-col lg:flex-row items-center justify-between bg-white/10 p-4 sm:p-6 mb-4 rounded-xl"}>
                <div className={"flex flex-row lg:flex-col justify-between text-start w-full lg:w-32"}>
                    <div className={"text-gray-400 sm:text-gray-100 text-xs sm:text-base font-bold"}>
                        {"Giornata " + (partita.giornata ?? "?")}
                    </div>
                    <div className={"text-gray-300 hidden lg:block"}>
                        {partita.girone ?? "?"}
                    </div>
                    <div className={"text-gray-400 sm:text-gray-100 text-xs sm:text-base font-bold block lg:hidden"}>
                        {partita.dataSvolgimento.toLocaleDateString() ?? "TBD"}
                    </div>
                </div>

                <div className={"match-info flex items-center justify-center py-2 sm:py-4 lg:py-0 w-full md:flex-1"}>
                    <span className={"w-full sm:w-64 text-right text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                        {partita.squadraCasa.nome ?? "???"}
                    </span>

                    <span className={"match-result text-xl sm:text-3xl text-chart-1 font-bold flex-shrink-0 -translate-y-0.5 md:-translate-y-0.75"}>
                        {partita.esito || " - "}
                    </span>

                    <span className={"w-full sm:w-64 text-left text-sm sm:text-xl font-bold translate-y-0 overflow-hidden text-ellipsis block"}>
                        {partita.squadraOspite.nome ?? "???"}
                    </span>
                </div>

                <div className={"flex flex-row lg:flex-col justify-between text-end w-full lg:w-32"}>
                    <div className={"text-gray-400 text-xs sm:text-sm block lg:hidden"}>
                        {partita.girone ?? "?"}
                    </div>
                    <div className={"font-bold hidden lg:block"}>
                        {partita.dataSvolgimento.toLocaleDateString() ?? "TBD"}
                    </div>
                    <div className={"text-gray-400 lg:text-gray-300 text-xs sm:text-sm"}>
                        {partita.dataSvolgimento.toLocaleTimeString().substring(0, 5) ?? "TBD"}
                    </div>
                </div>
            </div>
        </Link>
    )
}