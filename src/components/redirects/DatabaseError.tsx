import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function DatabaseError() {
    return (
        <>
            <Navbar />
            <div className={"w-full h-80 px-6 flex flex-col text-center justify-center items-center"}>
                <h1 className={"text-4xl font-bold mt-64 mb-4"}>
                    Errore sconosciuto!
                </h1>
                <h3 className={"text-xl font-bold mb-6"}>
                    Impossibile recuperare attualmente i dati, riprova tra qualche minuto
                </h3>
                <h6 className={"text-base font-semibold mb-8"}>
                    Se il problema persiste, contattaci!
                </h6>
                <Link href="/">
                    <Button variant="default" size="lg">
                        Torna alla Homepage
                    </Button>
                </Link>
            </div>
        </>
    )
}