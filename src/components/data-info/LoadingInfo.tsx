import {Spinner} from "@/components/ui/spinner";

import {Empty, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import Image from "next/image";

interface LoadingInfoProps {
    defaultSpinner?: boolean;
    infoMessage: string;
}

export default function LoadingInfo({defaultSpinner = false, infoMessage}: LoadingInfoProps) {
    return (
        <Empty className="w-full text-start text-zinc-300">
            <EmptyHeader className={"max-w-none"}>
                <EmptyTitle className="flex items-center justify-center text-xl sm:text-2xl">
                    {
                        defaultSpinner ? (
                            <Spinner className="me-2"/>
                        ) : (
                            <Image
                                src="/other/ball.png"
                                alt="Loading"
                                width={24}
                                height={24}
                                className="me-2 animate-spin opacity-80"
                            />
                        )
                    }
                    {infoMessage}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}