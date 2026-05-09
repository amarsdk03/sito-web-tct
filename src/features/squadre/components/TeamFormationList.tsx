import Link from "next/link";
import {formazioneSquadraType} from "@/features/squadre/queries";

import {Badge} from "@/components/ui/badge";
import PlayerSilhouette from "@/features/giocatori/components/PlayerSilhouette";
import {Constants} from "@/types/database.types";

interface TeamComponentsTableProps {
    stemmaSquadra: string,
    coloreSquadra: string,
    formazioneSquadra: formazioneSquadraType;
}

export default function TeamFormationList(
    {
        stemmaSquadra,
        coloreSquadra,
        formazioneSquadra
    }: TeamComponentsTableProps
) {
    const normalizedFormation = formazioneSquadra.map(f => ({
        ...f,
        ruoloPrincipale: f.giocatore?.ruolo_principale ?? null,
    }));

    const roles = [
        ...Object.values(Constants.public.Enums.ruolo_giocatore),
        null
    ];

    console.log("Formazione: ", normalizedFormation);

    return roles.map((role) => {
        const playersWithRole = normalizedFormation.filter(f => f.giocatore?.ruolo_principale === role);

        if (playersWithRole.length === 0) return null;

        return (
            <div key={role} className={"mb-6"}>
                <h3
                    className="integral-title font-semibold tracking-wide text-xl sm:text-3xl mb-4 sm:mb-6 -translate-x-0.75"
                    style={{color: (coloreSquadra + "ee")}}
                >
                    {role === null ? "Senza ruolo" : role.slice(0, -1) + "i"}
                </h3>

                {playersWithRole.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-x-6 gap-y-4">
                        {playersWithRole.map((f) => {
                            if (!f.giocatore) return null;

                            return (
                                <Link key={f.giocatore.id} href={"/giocatori/dettagli?id=" + f.giocatore.id}>
                                    <div className={"text-2xl font-medium bg-zinc-800 rounded-lg mb-2"}>
                                        <div className={"relative min-w-52 mx-0 overflow-hidden"}>
                                            <div className="integral-title absolute top-0 w-full p-4 z-0">
                                                <div className="flex justify-between not-italic text-md tracking-wider">
                                                    <div className={"flex flex-col items-start gap-0.5"}>
                                                        <span>
                                                            {f.giocatore.nome_maglia}
                                                        </span>
                                                        {f.giocatore.is_capitano && (
                                                            <span
                                                                className={"text-[0.6em]"}
                                                                style={{color: coloreSquadra}}
                                                            >
                                                                Capitano
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span>
                                                        {f.giocatore.numero_maglia && "#" + f.giocatore.numero_maglia}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={"flex justify-center"}>
                                                <div
                                                    className={`player-anim-hover max-w-52 ${!stemmaSquadra ? 'pt-5 px-4' : ''} translate-y-5`}>
                                                    <PlayerSilhouette
                                                        teamColor={coloreSquadra}
                                                        teamBadge={stemmaSquadra || undefined}
                                                        playerImage={f.giocatore.link_foto}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"text-xl font-semibold  bg-zinc-800"}>
                                            <div style={{backgroundColor: (coloreSquadra + "59")}} >
                                                <div className={"px-2 py-4 text-center"}>
                                                    {f.giocatore.nome + " " + f.giocatore.cognome}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-stone-300 text-md">
                        Nessun giocatore con questo ruolo
                    </div>
                )}
            </div>
        );
    });
}