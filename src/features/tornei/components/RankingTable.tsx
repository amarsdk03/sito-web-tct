import {AnimatePresence, motion} from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import {DEFAULT_LOGO_PATH} from "@/const/defaultConstants";

// Interfaccia per le statistiche della squadra in classifica
export interface SquadraClassifica {
    id: number;
    nome: string;
    acronimo: string;
    stemma: string;
    giocate: number;
    vinte: number;
    pareggi: number;
    perse: number;
    golFatti: number;
    golSubiti: number;
    diffReti: number;
    punti: number;
}

interface RankingTableProps {
    datiSquadre: SquadraClassifica[],
    mostraClassifiche?: boolean,
    mostraLeggenda?: boolean,
    numQualificate?: number,
    numPlayoff?: number,
    numEliminate?: number,
}

export default function RankingTable(
    {
        datiSquadre,
        mostraClassifiche = true,
        mostraLeggenda = true,
        numQualificate = 0,
        numPlayoff = 0,
        numEliminate = 0
    } : RankingTableProps
) {
    const containerAnim = {
        start: {opacity: 0},
        finish: {opacity: 1, transition: {staggerChildren: 0.1}},
    };

    const itemAnim = {
        start: {opacity: 0, x: -30},
        finish: {opacity: 1, x: 0, transition: {duration: 0.4}},
    };

    const totalTeams = datiSquadre.length;

    return (
        <div>
            <div className="overflow-x-auto rounded-sm bg-zinc-900/50 border border-mist-800">
                <table className="w-full text-xs sm:text-sm text-left text-mist-300">
                    <thead className="text-xs uppercase bg-mist-900/80 text-mist-400 font-semibold border-b border-mist-800">
                    <tr>
                        { mostraClassifiche && <th className="p-3 sm:px-4 sm:py-3 text-center w-12">Pos</th> }
                        <th className="p-3 sm:px-4 sm:py-3">Squadra</th>
                        <th className="p-2 sm:p-3 text-center font-bold text-mist-200">PT</th>
                        <th className="p-2 sm:p-3 text-center">G</th>
                        <th className="p-2 sm:p-3 text-center text-emerald-400">V</th>
                        <th className="p-2 sm:p-3 text-center text-amber-400">N</th>
                        <th className="p-2 sm:p-3 text-center text-red-400">P</th>
                        <th className="p-2 sm:p-3 text-center hidden sm:table-cell">GF</th>
                        <th className="p-2 sm:p-3 text-center hidden sm:table-cell">GS</th>
                        <th className="p-2 sm:p-3 text-center">DR</th>
                    </tr>
                    </thead>
                    <motion.tbody
                        variants={containerAnim}
                        initial={"start"}
                        animate={"finish"}
                        className="divide-y divide-mist-800/50"
                    >
                        <AnimatePresence>
                            {datiSquadre.map((squadra, index) => {
                                const pos = index + 1;

                                let zoneBorderClass = "border-l-3 border-l-transparent"; // Default trasparente per mantenere l'allineamento

                                if (mostraClassifiche) {
                                    if (numQualificate > 0 && pos <= numQualificate) {
                                        zoneBorderClass = "border-l-3 border-l-green-500"; // Qualificazione diretta
                                    } else if (numPlayoff > 0 && pos > numQualificate && pos <= (numQualificate + numPlayoff)) {
                                        zoneBorderClass = "border-l-3 border-l-yellow-500"; // Zona playoff
                                    } else if (numEliminate > 0 && pos > (totalTeams - numEliminate)) {
                                        zoneBorderClass = "border-l-3 border-l-red-500"; // Zona eliminazione
                                    }
                                }

                                return (
                                    <motion.tr key={squadra.id} variants={itemAnim} className="hover:bg-mist-800/30 transition-colors">
                                        {
                                            mostraClassifiche && (
                                                <td className="relative px-3 py-2 sm:px-4 sm:py-3.5 text-center font-bold">
                                                    {zoneBorderClass && (
                                                        <span
                                                            className={`absolute left-0 top-1 bottom-1 w-1 rounded-r-md ${zoneBorderClass}`}
                                                        />
                                                    )}
                                                    <span
                                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${
                                                            pos === 1 ? 'bg-amber-300/30 text-amber-200 border border-amber-400/30' :
                                                                pos === 2 ? 'bg-zinc-300/20 text-zinc-300 border border-zinc-400/30' :
                                                                    pos === 3 ? 'bg-amber-600/20 text-amber-500 border border-amber-700/30' :
                                                                        'text-mist-400'
                                                        }`}
                                                    >
                                                        {pos}
                                                    </span>
                                                </td>
                                            )
                                        }
                                        <td className="ranking-row-hover px-3 py-2 sm:px-4 sm:py-3.5 font-medium text-mist-100 sm:min-w-[180px]">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/squadre/dettagli?id=${squadra.id}`}
                                                    className={"flex items-center gap-2"}
                                                >
                                                    <Image
                                                        src={squadra.stemma || DEFAULT_LOGO_PATH}
                                                        alt="Stemma squadra"
                                                        width={24}
                                                        height={24}
                                                        className={`bg-none rounded-full object-cover shrink-0`}
                                                        draggable={false}
                                                        loading={"lazy"}
                                                    />
                                                    <span>
                                                        {squadra.nome}
                                                    </span>
                                                    <span className="text-xs text-mist-500 font-mono hidden md:inline translate-y-0.5">
                                                        ({squadra.acronimo ? squadra.acronimo : squadra.nome.slice(0, 3)})
                                                    </span>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="p-2 sm:p-3.5 text-center font-extrabold text-sm sm:text-base text-mist-100 bg-mist-800/20">
                                            {squadra.punti}
                                        </td>
                                        <td className="p-2 sm:p-3.5 text-center font-mono">{squadra.giocate}</td>
                                        <td className="p-2 sm:p-3.5 text-center text-emerald-400/90 font-mono">{squadra.vinte}</td>
                                        <td className="p-2 sm:p-3.5 text-center text-amber-400/90 font-mono">{squadra.pareggi}</td>
                                        <td className="p-2 sm:p-3.5 text-center text-red-400/90 font-mono">{squadra.perse}</td>
                                        <td className="p-2 sm:p-3.5 text-center font-mono hidden sm:table-cell text-mist-400">{squadra.golFatti}</td>
                                        <td className="p-2 sm:p-3.5 text-center font-mono hidden sm:table-cell text-mist-400">{squadra.golSubiti}</td>
                                        <td className={`p-2 sm:p-3.5 text-center font-semibold font-mono ${squadra.diffReti > 0 ? 'text-emerald-500' : squadra.diffReti < 0 ? 'text-red-500' : 'text-mist-400'}`}>
                                            {squadra.diffReti > 0 ? `+${squadra.diffReti}` : squadra.diffReti}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </motion.tbody>
                </table>
            </div>
            {
                mostraLeggenda && (
                    <div className="mt-4 p-4 rounded-sm bg-zinc-900/30 border border-mist-800/60 flex flex-col md:flex-row gap-6 md:gap-12 text-xs text-mist-400">
                        {
                            mostraClassifiche && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold uppercase tracking-wider text-mist-200 mb-1">
                                            Fasce Classifica
                                        </span>
                                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2">
                                            {numQualificate > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                                                    <span>Qualificazione diretta</span>
                                                </div>
                                            )}
                                            {numPlayoff > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                                                    <span>Playoff</span>
                                                </div>
                                            )}
                                            {numEliminate > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                                                    <span>Eliminazione</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px bg-mist-800 self-stretch" />
                                </>
                            )
                        }

                        <div className="flex flex-col gap-2">
                            <span className="font-semibold uppercase tracking-wider text-mist-200 mb-1">
                                Legenda Statistiche
                            </span>
                            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-x-4 gap-y-1 font-medium">
                                <div className="flex gap-1">
                                    <span className="text-mist-300 font-bold">PT:</span>
                                    <span className="text-mist-400">Punti</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-mist-300 font-bold">G:</span>
                                    <span className="text-mist-400">Giornata</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-emerald-400 font-bold">V:</span>
                                    <span className="text-mist-400">Vittorie</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-amber-400 font-bold">N:</span>
                                    <span className="text-mist-400">Pareggi</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-red-400 font-bold">P:</span>
                                    <span className="text-mist-400">Sconfitte</span>
                                </div>
                                <div className="gap-1 hidden sm:flex">
                                    <span className="text-mist-300 font-bold">GF:</span>
                                    <span className="text-mist-400">Goal fatti</span>
                                </div>
                                <div className="gap-1 hidden sm:flex">
                                    <span className="text-mist-300 font-bold">GS:</span>
                                    <span className="text-mist-400">Goal subiti</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-mist-300 font-bold">DR:</span>
                                    <span className="text-mist-400">Diff. reti</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}