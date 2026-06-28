import LogoLoop from '@/components/reactbits/LogoLoop';
import {carouselSponsorData} from "@/const/sponsors";
import useIsMobile from "@/lib/isMobile";

export default function CarouselSponsor() {
    const isMobile = useIsMobile();

    return (
        <div style={{ height: isMobile ? '75px' : '100px', position: 'relative', overflow: 'hidden'}}>
            <LogoLoop
                logos={carouselSponsorData}
                speed={30}
                direction="left"
                logoHeight={isMobile ? 50 : 75}
                gap={isMobile ? 30 : 40}
                pauseOnHover={false}
                scaleOnHover={true}
                ariaLabel="Sponsor e collaboratori"
            />
        </div>
    )
}