import Image from "next/image"

import {Card} from "@/components/ui/card"
import AwardData from "@/types/award";

export default function AwardCardInfo({ awardInfo }: { awardInfo: AwardData }) {
    return (
        <Card className="navbar-card relative mx-auto w-full h-32 pt-0 mb-4">
            <div className="absolute bottom-0 left-0 z-30 p-4">
                <div className="navbar-card-title">
                    { awardInfo.titolo }
                </div>
                <div className="-mt-1">
                    { awardInfo.edizione }
                </div>
            </div>
            <Image
                src={ awardInfo.logo ?? "/backgrounds/trophy.webp" }
                alt={ awardInfo.titolo }
                width={500}
                height={500}
                className={`navbar-card-img relative z-20 object-cover`}
                loading={"lazy"}
            />
        </Card>
    )
}