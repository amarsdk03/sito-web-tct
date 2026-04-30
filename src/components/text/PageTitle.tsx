'use client';
import {motion} from "framer-motion";

interface PageMainTitleProps {
    title: string,
    description?: string,
}

export default function PageTitle({ title, description } : PageMainTitleProps ) {
    const titleAnim = {
        start: { opacity: 0, x: -25 },
        finish: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    }

    return (
        <div>
            <motion.h1
                variants={titleAnim}
                initial={"start"}
                animate={"finish"}
                className={"page-title shine-anim-hover"}
            >
                { title }
            </motion.h1>
            {
                description && (
                    <p>
                        { description }
                    </p>
                )
            }
        </div>
    )
}