'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {samplePartite} from "@/sampleData/partite";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FixtureResultRow from "@/features/partite/components/FixtureResultRow";
import FixtureSearchFilters from "@/features/partite/components/FixtureSearchFilters";

import {Separator} from "@/components/ui/separator";
import PageTitle from "@/components/text/PageTitle";

export default function Fixtures() {
    const containerAnim = {
        start: { opacity: 0 },
        finish: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // delay between child elements
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
                        title={"Partite"}
                        description={"Tutti i risultati e gli incontri in live e in arrivo, filtrabili in base all'edizione, alla categoria e alla giornata."}
                    />
                    <div className={"mt-8"}>
                        <h2 className={"font-semibold text-lg mb-2"}>
                            Filtra per:
                        </h2>
                        <FixtureSearchFilters />
                    </div>
                    <Separator className={"my-6"} />
                    <motion.div
                        variants={containerAnim}
                        initial={"start"}
                        animate={"finish"}
                    >
                        <AnimatePresence>
                            {
                                samplePartite.map((partita) => (
                                    <motion.div
                                        key={partita.id}
                                        variants={itemAnim}
                                    >
                                        <FixtureResultRow partita={partita} />
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