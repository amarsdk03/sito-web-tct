import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function WrongDataContact() {
    return (
        <div className={"w-full mt-20"}>
            <div className={"w-full flex flex-col justify-center items-center text-center"}>
                <h1 className={"text-xl sm:text-2xl font-bold mb-4"}>
                    Informazioni errate o mancanti?
                </h1>
                <Link href="https://www.instagram.com/torneocittaditrento/" target="_blank">
                    <Button variant="default" size="lg" className="text-sm sm:text-lg font-medium sm:p-5">
                        Faccelo sapere!
                    </Button>
                </Link>
            </div>
        </div>
    )
}