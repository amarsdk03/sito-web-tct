'use client';

import {samplePartite} from "@/sampleData/partite";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import {Separator} from "@/components/ui/separator";
import {RiFootballFill, RiFootballLine} from "@remixicon/react";
import Image from "next/image";
import {giocatoriSquadraAway, giocatoriSquadraHome} from "@/sampleData/giocatori";

export default function InfoPartita() {
    const datiPartita = samplePartite[0];

    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Dettagli partita"}
                        smallerTitle={true}
                    />

                    <div className={"match-result w-full text-center text-7xl mt-6 mb-10 sm:mt-12 sm:mb-6 font-bold"}>
                        {datiPartita.esito || " - "}
                    </div>

                    <div className={"grid grid-cols-5 items-center gap-6 w-full"}>
                        <span className={"col-span-2 text-start text-lg sm:text-2xl md:text-4xl text-mist-200 font-extrabold overflow-hidden text-ellipsis"}>
                            {datiPartita.squadraCasa.nome ?? "???"}
                        </span>

                        <span className={"match-result text-center text-2xl text-chart-1 font-bold -translate-y-0.5"}>
                            {" vs "}
                        </span>

                        <span className={"col-span-2 text-end text-lg sm:text-2xl md:text-4xl text-mist-200 font-extrabold overflow-hidden text-ellipsis"}>
                            {datiPartita.squadraOspite.nome ?? "???"}
                        </span>
                    </div>

                    <div className={"grid grid-cols-2 gap-4 mt-4 w-full"}>
                        <div className={"text-xs sm:text-base text-mist-300 font-bold"}>
                            <div className={"flex items-center justify-start"}>
                                <div className={"flex items-center justify-start"}>
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                </div>
                                <span className={"ms-2 truncate text-ellipsis"}>
                                    {"Del Dot Simone"}
                                </span>
                            </div>
                        </div>

                        <div className={"text-xs sm:text-base text-mist-300 font-bold"}>
                            <div className={"flex items-center justify-end"}>
                                <span className={"me-2 truncate text-ellipsis"}>
                                    {"Nicolò Fennato"}
                                </span>
                                <div className={"flex items-center justify-end"}>
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                    <Image
                                        src={"/icons/goal.png"}
                                        alt={"Goal"}
                                        width={20}
                                        height={20}
                                        className={"action-icon"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className={"mt-16 mb-8"} />

                    <div className={"space-y-6 w-full"}>
                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Girone
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {datiPartita.girone}
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Giornata
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {datiPartita.giornata}
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className={"text-mist-400 text-sm md:text-base"}>
                                Data e ora partita
                            </div>
                            <div className={"text-mist-300 font-semibold text-sm md:text-base text-end"}>
                                {datiPartita.dataSvolgimento.toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                                {" - "}
                                {datiPartita.dataSvolgimento.toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>

                    <Separator className={"my-8"} />

                    <div>
                        <h4 className={"text-center text-xl md:text-3xl text-mist-200 font-extrabold overflow-hidden text-ellipsis mt-12 mb-8 sm:my-16"}>
                            Formazioni squadre
                        </h4>
                        <div className={"grid grid-cols-2 auto-rows-fr gap-14 text-mist-400 text-base md:text-lg"}>
                            <div className={"text-start"}>
                                {
                                    giocatoriSquadraHome.map((name, index) => (
                                        <p key={index} className="player-name pb-4 md:pb-6">
                                            {name}
                                        </p>
                                    ))
                                }
                            </div>

                            <div className={"text-end"}>
                                {
                                    giocatoriSquadraAway.map((name, index) => (
                                        <p key={index} className="player-name pb-4 md:pb-6">
                                            {name}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </>
    )
}