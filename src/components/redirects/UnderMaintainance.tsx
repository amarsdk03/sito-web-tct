import Navbar from "@/components/navbar/Navbar";

export default function UnderMaintainance() {
    return (
        <>
            <Navbar noButtons={true} />
            <div className={"w-full h-80 px-6 flex flex-col text-center justify-center items-center"}>
                <h1 className={"text-4xl font-bold mt-64 mb-4"}>
                    Sito web in manutenzione
                </h1>
                <h3 className={"text-xl text-zinc-300 font-bold mb-8"}>
                    Torneremo operativi il prima possibile, promesso!
                </h3>
            </div>
        </>
    )
}