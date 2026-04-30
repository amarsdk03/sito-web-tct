'use client';

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageTitle from "@/components/text/PageTitle";

export default function InfoPartita() {
    return (
        <>
            <Navbar />
            <div className={"page-container"}>
                <div className={"page-content mt-2 lg:mt-12"}>
                    <PageTitle
                        title={"Dettagli partita"}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}