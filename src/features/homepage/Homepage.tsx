import Image from "next/image";
import {navbarLinks} from "@/const/pageCards";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import NavbarMenuCard from "@/components/menu/NavbarMenuCard";
import PageTitle from "@/components/text/PageTitle";
import CarouselSponsor from "@/components/carousel/CarouselSponsor";

export default function Homepage() {
    return (
        <>
            <main className={"flex-1"}>
                <Navbar />
                <div className={"page-container"}>
                    <div className={"homepage-content lg:mt-10"}>
                        <Image
                            src={"/backgrounds/homepage_hero.png"}
                            alt={"Stadio Briamasco"}
                            width={1920}
                            height={1080}
                            className={"w-full lg:rounded-sm lg:px-4 mx-auto"}
                        />
                    </div>
                    <div className={"w-full mt-8 sm:mt-16"}>
                        <div className={"text-center font-semibold text-lg sm:text-2xl mb-4 sm:mb-8"}>
                            Grazie al supporto di
                        </div>
                        <CarouselSponsor />
                    </div>
                    <div className={"homepage-content"}>
                        <div className={"px-4 mt-6 sm:mt-16"}>
                            <PageTitle title={"Cerca"} smallerTitle={true} />
                            <div className="grid sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
                                {
                                    navbarLinks.map((link, index) => (
                                        <NavbarMenuCard key={index} link={link} globalTranslate={-20} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className={"text-center font-medium text-gray-300 text-xl mt-16 sm:mt-24 mb-2"}>
                            Sito web ancora in sviluppo...
                        </div>
                        <div className={"text-center font-semibold text-2xl"}>
                            Presto moltissime novità!
                        </div>
                        <div className={"text-center font-medium text-amber-300 text-lg mt-2"}>
                            Coming estate 2026...
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}