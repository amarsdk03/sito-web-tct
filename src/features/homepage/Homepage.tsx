import Navbar from "@/components/navbar/Navbar";
import PageTitle from "@/components/text/PageTitle";
import Footer from "@/components/footer/Footer";
import NavbarMenuCard from "@/components/navbar/NavbarMenuCard";
import {navbarLinks} from "@/const/page-cards";

export default function Homepage() {
    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Home"}
                        description={"Work in progress!"}
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