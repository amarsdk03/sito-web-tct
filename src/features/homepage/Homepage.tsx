import {navbarLinks} from "@/const/pageCards";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";
import NavbarMenuCard from "@/components/navbar/NavbarMenuCard";

export default function Homepage() {
    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-6 lg:mt-12"}>
                    <PageTitle
                        title={"Homepage"}
                        description={"Presto in arrivo..."}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
                        {
                            navbarLinks.map((link, index) => (
                                <NavbarMenuCard key={index} link={link} globalTranslate={-20} />
                            ))
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}