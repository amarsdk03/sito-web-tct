import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function NotFound() {
    return (
        <>
            <Navbar />
            <div className={"w-full h-80 px-6 flex flex-col text-center justify-center items-center"}>
                <h1 className={"text-4xl font-bold mt-64 mb-4"}>
                    Pagina non trovata!
                </h1>
                <h3 className={"text-xl font-bold mb-8"}>
                    Controlla che l&#39;URL sia corretto
                </h3>
                <Link href="/">
                    <Button variant="default" size="lg">
                        Torna alla Homepage
                    </Button>
                </Link>
            </div>
        </>
    )
}