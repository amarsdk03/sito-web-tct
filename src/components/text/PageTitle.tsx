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
            <motion.h1
                variants={slideAnim}
                initial={"start"}
                animate={"finish"}
                className={"page-title shine-anim-hover"}
                style={{ fontSize: smallerTitle ? "min(5vw, 1.8em)" : "min(12vw, 3.75em)" }}
            >
                { title }
            </motion.h1>
            {
                description && <p>{ description }</p>
            }
        </>
    )
}