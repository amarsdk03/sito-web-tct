import Image from "next/image"

import {Card} from "@/components/ui/card"

export default function AwardCardInfo({ awardInfo }: { awardInfo: object }) {
    return (
        <Card className="navbar-card relative mx-auto w-full h-32 pt-0 mb-4">
            <div className="absolute bottom-0 left-0 z-30 p-4">
                <div className="navbar-card-title">
                    Titolo qui
                </div>
                <div className="-mt-1">
                    Edizione torneo qui
                </div>
            </div>
            <Image
                src={ "/backgrounds/trophy.webp" }
                alt={ "Titolo qui" }
                width={500}
                height={500}
                className={`navbar-card-img relative z-20 object-cover`}
                loading={"lazy"}
            />
        </Card>
    )
}