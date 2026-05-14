import {Empty, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import {XIcon} from "lucide-react";

interface ErrorInfoProps {
    infoMessage: string;
    contentOpacity?: number;
}

export default function ErrorInfo({infoMessage, contentOpacity = 1}: ErrorInfoProps) {
    return (
        <Empty className="w-full text-red-300 pb-6" style={{opacity: contentOpacity}}>
            <EmptyHeader className={"max-w-none text-center"}>
                <EmptyTitle className="flex items-center justify-center text-lg sm:text-2xl">
                    <XIcon className="me-2" /> {infoMessage}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}