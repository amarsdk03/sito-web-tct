import Image from "next/image";
import { useRef, useState } from "react";

import PlayerInfoData from "@/types/player";
import DynamicReactFlag from "@/components/flags/DynamicReactFlag";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiShareFill, RiDownloadCloud2Line, RiInstagramLine, RiGlobalLine, RiLink } from "@remixicon/react";

interface ShareProfileDialogProps {
    datiGiocatore: PlayerInfoData;
    coloreSquadra: string;
}

export default function ShareProfileDialog(
    { datiGiocatore, coloreSquadra }: ShareProfileDialogProps
) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const downloadCard = async () => {
        if (!cardRef.current) return;

        setIsExporting(true);
        try {
            const { toPng } = await import('html-to-image');

            // Find the scrollable inner div
            const scrollableDiv = cardRef.current.querySelector('[class*="overflow-y-auto"]') as HTMLElement;

            // Store original styles
            const originalBorderRadius = cardRef.current.style.borderRadius;
            const originalMaxHeight = scrollableDiv?.style.maxHeight;
            const originalOverflow = scrollableDiv?.style.overflow;

            // Temporarily show all content and remove rounded corners
            if (scrollableDiv) {
                cardRef.current.style.borderRadius = '0';
                scrollableDiv.style.maxHeight = 'none';
                scrollableDiv.style.overflow = 'visible';
            }

            // Wait a moment for DOM to update
            await new Promise(resolve => setTimeout(resolve, 50));

            // Export the card with all content visible
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#000000',
            });

            // Restore original styles immediately after export
            if (scrollableDiv) {
                cardRef.current.style.borderRadius = originalBorderRadius || '';
                scrollableDiv.style.maxHeight = originalMaxHeight || '';
                scrollableDiv.style.overflow = originalOverflow || '';
            }

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${datiGiocatore.nome}-${datiGiocatore.cognome}-stats.png`;
            link.click();
        } catch (error) {
            console.error('Error generating card:', error);
            alert('Errore nella generazione dell\'immagine. Riprova.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    style={{ color: coloreSquadra }}
                >
                    <RiShareFill />
                    <span className="not-italic -translate-y-0.5">
                        Condividi
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        Condividi player card
                    </DialogTitle>
                </DialogHeader>

                <div
                    ref={cardRef}
                    className="relative rounded-2xl p-8 py-6 text-white"
                    style={{
                        background: `linear-gradient(135deg, ${coloreSquadra}CC 0%, ${coloreSquadra}88 100%)`,
                    }}
                >
                    <div className="relative z-10 space-y-6 no-scrollbar max-h-[60vh] pb-1 overflow-x-hidden overflow-y-auto">

                        <div className="flex items-start justify-between break-all">
                            <div className="flex-1 text-md font-bold opacity-90 pe-8">
                                <div className="flex items-center gap-1 mb-2">
                                    <Image
                                        src={datiGiocatore.linkStemmaSquadra ?? "/logo_eagle_only.png"}
                                        alt="Stemma squadra"
                                        width={20}
                                        height={20}
                                        className={`player-card-stemma bg-none rounded-full object-cover`}
                                        draggable={false}
                                        priority
                                    />
                                    <div className="font-semibold tracking-wide opacity-80 -translate-y-0.25">
                                        {datiGiocatore.nomeSquadra}
                                    </div>
                                </div>
                                <h1 className="integral-title text-3xl font-black leading-tight">
                                    {datiGiocatore.nome}
                                </h1>
                                <h2 className="integral-title text-xl font-bold opacity-90">
                                    {datiGiocatore.cognome}
                                </h2>
                            </div>

                            {
                                datiGiocatore.numeroMaglia && (
                                    <div className="flex flex-col items-center mt-4">
                                        <div className="text-6xl font-black leading-none">
                                            {datiGiocatore.numeroMaglia}
                                        </div>
                                        <div className="text-xs uppercase tracking-wider mt-1 opacity-80">
                                            Numero
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white border-opacity-20">
                            <div className="space-y-1">
                                <div className="text-4xl font-black">
                                    {datiGiocatore.numeroPartiteGiocate || 0}
                                </div>
                                <div className="text-sm uppercase tracking-wider opacity-80 font-semibold">
                                    Partite
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-4xl font-black">
                                    {datiGiocatore.numeroGoal || 0}
                                </div>
                                <div className="text-sm uppercase tracking-wider opacity-80 font-semibold">
                                    Goal
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-4xl font-black">
                                    {datiGiocatore.numeroAssist || 0}
                                </div>
                                <div className="text-sm uppercase tracking-wider opacity-80 font-semibold">
                                    Assist
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-4xl font-black">
                                    {datiGiocatore.numeroMVP || 0}
                                </div>
                                <div className="flex text-sm uppercase tracking-wider opacity-80 font-semibold">
                                    MVP <span className={"hidden sm:block ms-1"}>of the match</span>
                                </div>
                            </div>
                        </div>

                        {(datiGiocatore.altezza || datiGiocatore.peso || datiGiocatore.piedePreferito) && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-4 pt-7 border-t border-white border-opacity-20 text-sm">
                                {datiGiocatore.ruoloPrincipale && (
                                    <div>
                                        <div className="opacity-80 text-xs uppercase tracking-wider mb-1 pe-7">
                                            Ruolo
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-bold uppercase tracking-wide"
                                            style={{
                                                backgroundColor: coloreSquadra,
                                                color: 'white',
                                            }}
                                        >
                                            <span className={"translate-y-0.25"}>
                                                {datiGiocatore.ruoloPrincipale}
                                            </span>
                                        </Badge>
                                    </div>
                                )}
                                {datiGiocatore.piedePreferito && (
                                    <div className={"translate-x-7"}>
                                        <div className="opacity-80 text-xs uppercase tracking-wider mb-1">
                                            Piede
                                        </div>
                                        <div className="font-bold text-base">
                                            {datiGiocatore.piedePreferito}
                                        </div>
                                    </div>
                                )}
                                {datiGiocatore.nazionalita && (
                                    <div className={"sm:translate-x-8"}>
                                        <div className="opacity-80 text-xs uppercase tracking-wider mb-1">
                                            Nazione
                                        </div>
                                        <div className={"flex gap-1.5 items-center"}>
                                            <DynamicReactFlag
                                                countryCode={datiGiocatore.nazionalita}
                                                size={"4"}
                                            />
                                            <div className="font-bold text-base">
                                                { datiGiocatore.nazionalita }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-5 border-t border-white border-opacity-20">
                            <div className="flex items-center text-xs uppercase tracking-widest opacity-75 mb-1">
                                <RiGlobalLine className={"size-5 me-1"} />
                                www.torneo-citta-di-trento.it
                            </div>
                            <div className="flex items-center text-xs uppercase tracking-widest opacity-75">
                                <RiInstagramLine className={"size-5 me-1"} />
                                @torneocittaditrento
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href).then()
                        }}
                    >
                        <RiLink />
                        Copia link
                    </Button>
                    <Button
                        onClick={downloadCard}
                        disabled={isExporting}
                        style={{
                            backgroundColor: (coloreSquadra + "80"),
                            color: 'white',
                        }}
                    >
                        <RiDownloadCloud2Line />
                        {isExporting ? 'Generazione...' : 'Scarica PNG'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}