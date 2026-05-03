import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function ComingSoon() {
    return (
        <>
            <Navbar />
            <div className={"w-full h-80 flex flex-col justify-center items-center text-center p-12"}>
                <h1 className={"text-4xl font-bold mt-64 mb-4"}>
                    Pagina in lavorazione!
                </h1>
                <h1 className={"text-xl font-bold mb-8"}>
                    Questa sezione del sito è presto in arrivo... :)
                </h1>
                <Link href="/">
                    <Button variant="default" size="lg">
                        Torna alla Homepage
                    </Button>
                </Link>
            </div>
        </>
    )
}