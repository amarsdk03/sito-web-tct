'use client';

import {motion} from "framer-motion";
import {ArrowLeftIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface PageMainTitleProps {
    title: string,
    description?: string,
    smallerTitle?: boolean,
    withGoBackBtn?: boolean,
}

export default function PageTitle({ title, description, smallerTitle, withGoBackBtn } : PageMainTitleProps ) {
    const router = useRouter();

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
                {
                    withGoBackBtn && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="translate-y-1.25 sm:translate-y-1.75"
                            onClick={() => router.back()}
                        >
                            <ArrowLeftIcon />
                        </Button>
                    )
                }
                <h1
                    className={"page-title shine-anim-hover pe-1"}
                    style={{ fontSize: smallerTitle ? "min(5vw, 1.8em)" : "min(12vw, 3.75em)" }}
                >
                    { title }
                </h1>
            </motion.div>
            {
                description && <p>{ description }</p>
            }
        </>
    )
}