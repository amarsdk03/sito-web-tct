import {Empty, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import {XIcon} from "lucide-react";

interface ErrorInfoProps {
    infoMessage: string;
}

export default function ErrorInfo({infoMessage}: ErrorInfoProps) {
    return (
        <Empty className="p-4 text-red-300">
            <EmptyHeader className={"max-w-none"}>
                <EmptyTitle className="flex items-center justify-center text-md sm:text-2xl">
                    <XIcon className="me-2" /> {infoMessage}
                </EmptyTitle>
            </EmptyHeader>
        </Empty>
    )
}