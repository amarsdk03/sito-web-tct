import LogoLoop from '@/components/reactbits/LogoLoop';
import {carouselSponsorData} from "@/const/sponsors";

export default function CarouselSponsor() {
    return (
        <div style={{ height: '50px', position: 'relative', overflow: 'hidden'}}>
            <LogoLoop
                logos={carouselSponsorData}
                speed={25}
                direction="left"
                logoHeight={30}
                gap={20}
                pauseOnHover={false}
                fadeOut={true}
                fadeOutColor="#0C0A0900"
                ariaLabel="Sponsor e collaboratori"
            />
        </div>
    )
}