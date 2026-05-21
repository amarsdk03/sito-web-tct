import LogoLoop from '@/components/reactbits/LogoLoop';
import {carouselSponsorData} from "@/const/sponsors";

export default function CarouselSponsor() {
    return (
        <div style={{ height: '100px', position: 'relative', overflow: 'hidden'}}>
            <LogoLoop
                logos={carouselSponsorData}
                speed={30}
                direction="left"
                logoHeight={75}
                gap={40}
                pauseOnHover={false}
                scaleOnHover={true}
                ariaLabel="Sponsor e collaboratori"
            />
        </div>
    )
}