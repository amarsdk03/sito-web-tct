import {Empty, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import {XIcon} from "lucide-react";

interface ErrorInfoProps {
    infoMessage: string;
    contentOpacity?: number;
}

export default function ErrorInfo({infoMessage, contentOpacity = 1}: ErrorInfoProps) {
    return (
        <Empty className="w-full text-start text-red-300" style={{opacity: contentOpacity}}>
            <EmptyHeader className={"max-w-none"}>
                <EmptyTitle className="flex items-center justify-center text-md sm:text-2xl">
                    <XIcon className="me-2" /> {infoMessage}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}