import Navbar from "@/components/navbar/Navbar";

export default function UnderMaintainance() {
    return (
        <>
            <Navbar />
            <div className={"w-full h-80 px-6 flex flex-col text-center justify-center items-center"}>
                <h1 className={"text-4xl font-bold mt-64 mb-4"}>
                    Sito web in manutenzione
                </h1>
                <h3 className={"text-xl text-zinc-300 font-bold mb-8"}>
                    Saremo operativi il prima possibile, torna presto!
                </h3>
            </div>
        </>
    )
}