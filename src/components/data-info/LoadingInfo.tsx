import {Spinner} from "@/components/ui/spinner";

import {Empty, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import Image from "next/image";

interface LoadingInfoProps {
    infoMessage: string;
    contentOpacity?: number;
    defaultSpinner?: boolean;
}

export default function LoadingInfo({defaultSpinner = false, contentOpacity = 1, infoMessage}: LoadingInfoProps) {
    return (
        <Empty className="w-full text-start text-zinc-200" style={{opacity: contentOpacity}}>
            <EmptyHeader className={"max-w-none"}>
                <EmptyTitle className="flex items-center justify-center text-lg sm:text-xl">
                    {
                        defaultSpinner ? (
                            <Spinner className="me-2"/>
                        ) : (
                            <Image
                                src="/other/ball.png"
                                alt="Loading"
                                width={24}
                                height={24}
                                className="me-2 animate-spin -translate-y-0.25"
                            />
                        )
                    }
                    {infoMessage}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}