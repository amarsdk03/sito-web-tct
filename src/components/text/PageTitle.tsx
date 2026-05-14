'use client';

import {motion} from "framer-motion";

interface PageMainTitleProps {
    title: string,
    description?: string,
    smallerTitle?: boolean,
}

export default function PageTitle({ title, description, smallerTitle } : PageMainTitleProps ) {
    const slideAnim = {
        start: { opacity: 0, x: -25 },
        finish: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    }

    return (
        <>
            <motion.div
                variants={slideAnim}
                initial={"start"}
                animate={"finish"}
                className={"flex items-center gap-2"}
            >
                <h1
                    className={"page-title shine-anim-hover pe-2"}
                    style={{ fontSize: smallerTitle ? "min(4.5vw, 1.6em)" : "min(12vw, 3.75em)" }}
                >
                    { title }
                </h1>
            </motion.div>
            {
                description && (
                    <p className={"mt-2 sm:mt-3"}>
                        { description }
                    </p>
                )
            }
        </>
    )
}