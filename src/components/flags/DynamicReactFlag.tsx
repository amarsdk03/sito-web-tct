import * as configFlags from "country-flag-icons/react/3x2";
import getCountryISO2 from "@/components/flags/iso3to3convert";
import { ComponentType } from "react";

type FlagIconType = ComponentType<{ title?: string; className?: string }>;

export default function DynamicReactFlag(
    {
        countryCode,
        size = "8"
    } : {
        countryCode?: string,
        size?: string
    }
) {
    const alpha2Code = getCountryISO2(countryCode) || "IT";
    const FlagIcon = (configFlags[alpha2Code as keyof typeof configFlags] as FlagIconType) || (configFlags.IT as FlagIconType);

    return (
        <FlagIcon title={countryCode} className={`size-${size}`} />
    );
}