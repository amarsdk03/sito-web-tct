'use client';

import { motion, AnimatePresence } from 'framer-motion';

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import {Separator} from "@/components/ui/separator";
import PageTitle from "@/components/text/PageTitle";
import TeamInfoCard from "@/features/squadre/components/TeamInfoCard";
import {sampleSquadre} from "@/sampleData/squadre";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

export default function Teams() {
    const containerAnim = {
        start: { opacity: 0 },
        finish: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // delay between child elements
            },
        },
    };

    const itemAnim = {
        start: { opacity: 0, y: -10 },
        finish: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Squadre"}
                        description={"Tutte le squadre iscritte alle varie edizioni del torneo, sia passate che attuali"}
                    />
                    <div className={"w-full flex flex-col sm:flex-row justify-between gap-4 mt-8"}>
                        <div>
                            <h2 className={"font-semibold text-lg mb-2"}>
                                Cerca squadra:
                            </h2>
                            <Field className="w-full min-w-full sm:min-w-96">
                                <Input
                                    id="teamSearch"
                                    type="text"
                                    placeholder="Nome squadra, giocatore della squadra..."
                                    aria-label="Cerca squadra"
                                    className="rounded-lg"
                                />
                            </Field>
                        </div>
                        <div>
                            <h2 className={"font-semibold text-lg sm:text-end mb-2"}>
                                Filtra per:
                            </h2>
                            <Select>
                                <SelectTrigger className="w-full min-w-full sm:min-w-48 rounded-lg">
                                    <SelectValue placeholder="Edizione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className={"bg-background"}>
                                        <SelectLabel>Edizione torneo</SelectLabel>
                                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                                        <SelectItem value="2024/2025" disabled>2024/2025 (in arrivo...)</SelectItem>
                                        <SelectItem value="2023/2024" disabled>2023/2024 (in arrivo...)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator className={"my-6"} />
                    <motion.div
                        variants={containerAnim}
                        initial={"start"}
                        animate={"finish"}
                        className={"grid grid-cols-1 md:grid-cols-2 gap-4"}
                    >
                        <AnimatePresence>
                            {
                                sampleSquadre.map((squadra) => (
                                    <motion.div
                                        key={squadra.id}
                                        variants={itemAnim}
                                    >
                                        <TeamInfoCard squadra={squadra} />
                                    </motion.div>
                                ))
                            }
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    )
}