import Navbar from "@/components/navbar/Navbar";

export default function Homepage() {
    return (
        <>
            <Navbar />
            <div className={"w-full h-80 flex flex-col justify-center items-center"}>
                <h1 className={"text-4xl font-bold mt-64 mb-2"}>
                    Homepage
                </h1>
                <h1 className={"text-xl font-bold"}>
                    (Coming soon...)
                </h1>
            </div>
        </>
    )
}