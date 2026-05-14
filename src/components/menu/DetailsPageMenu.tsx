import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";

import PageTitle from "@/components/text/PageTitle";

import {
    ChevronLeftIcon,
    EllipsisVerticalIcon,
    MessageCircleWarningIcon,
    RefreshCwIcon,
    Share2Icon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

export default function DetailsPageMenu({ pageTitle }: { pageTitle: string}) {
    const router = useRouter();

    const [condividiLinkText, setCondividiLinkText] = useState("Condividi link");

    function condividiLink() {
        const textValue = condividiLinkText;

        navigator.clipboard.writeText(window.location.href).then(
            () => {
                setCondividiLinkText("Link copiato!");
                setTimeout(() => setCondividiLinkText(textValue), 2000);
            }
        );
    }

    return (
        <div className={"flex justify-between items-center gap-4 mb-6 sm:mb-10"}>
            <div className={"flex items-center"}>
                <Button
                    size={"icon-xs"}
                    variant={"default"}
                    className={"inline-flex sm:hidden translate-y-0.25"}
                    onClick={() => router.back()}
                >
                    <ChevronLeftIcon className={"size-5 pe-0.5"} />
                </Button>
                <Button
                    size={"icon-sm"}
                    variant={"default"}
                    className={"hidden sm:inline-flex translate-y-0.5 me-1"}
                    onClick={() => router.back()}
                >
                    <ChevronLeftIcon className={"size-6 pe-0.5"} />
                </Button>
            </div>
            <div className={"w-full flex items-center justify-start"}>
                <PageTitle
                    title={pageTitle}
                    smallerTitle={true}
                />
            </div>
            <div className={"flex items-center gap-2"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size={"icon-xs"}
                            variant={"outline"}
                        >
                            <EllipsisVerticalIcon className={"size-4 pe-0.25"} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => router.refresh()}>
                            <RefreshCwIcon />
                            Aggiorna
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={condividiLink}>
                            <Share2Icon />
                            { condividiLinkText }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href="https://www.instagram.com/torneocittaditrento/" target="_blank">
                            <DropdownMenuItem variant="destructive">
                                    <MessageCircleWarningIcon />
                                    Segnala info errate
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}