import {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {listaTorneiType} from "@/server/data/rankings";

import {ToggleGroup, ToggleGroupItem,} from "@/components/ui/toggle-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {TextIcon, UserIcon} from "lucide-react";

interface FormationYearFilterProps {
    loading?: boolean,
    showAsSilhouette: boolean,
    setShowAsSilhouette: (showAsSilhouette: boolean) => void,
    pathname?: string,
    idSquadra?: number,
    squadraParamName?: string,
    edizioneParamName?: string,
    listaTornei?: listaTorneiType
}

export default function FormationFilters(
    {
        loading = false,
        showAsSilhouette,
        setShowAsSilhouette,
        pathname,
        idSquadra,
        squadraParamName,
        edizioneParamName,
        listaTornei,
    }: FormationYearFilterProps
) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasInitialized = useRef(false);

    const [filtroTorneo, setFiltroTorneo] = useState<string>("");

    useEffect(() => {
        if (listaTornei && edizioneParamName && listaTornei.length > 0 && !hasInitialized.current) {
            const currentUrlVal = searchParams.get(edizioneParamName);
            setFiltroTorneo(currentUrlVal || listaTornei[0].id.toString());
            hasInitialized.current = true;
        }
    }, [listaTornei, searchParams, edizioneParamName]);

    if (loading) return (
        <Button
            variant="outline"
            className="bg-secondary text-chart-3 hover:text-chart-2"
            aria-label="Filtra edizione torneo"
        >
            <Spinner/>
        </Button>
    );

    return (
        <div className={"flex justify-start sm:justify-end gap-2"}>
            {
                listaTornei && edizioneParamName && squadraParamName && idSquadra && (
                    <Select value={filtroTorneo} onValueChange={(val) => {
                        setFiltroTorneo(val);

                        const params = new URLSearchParams();
                        params.set(squadraParamName, idSquadra.toString());
                        params.set(edizioneParamName, val);

                        router.push(`${pathname}?${params.toString()}`, { scroll: false });
                    }}>
                        <SelectTrigger size="sm" className="w-full sm:w-fit">
                            <SelectValue placeholder="Edizione torneo"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    Ultima edizione:
                                </SelectLabel>
                                {listaTornei.length > 0 && (
                                    <SelectItem value={listaTornei[0].id.toString()}>
                                        {listaTornei[0].nome}
                                    </SelectItem>
                                )}
                            </SelectGroup>
                            <SelectSeparator/>
                            <SelectGroup>
                                <SelectLabel>
                                    Edizioni passate:
                                </SelectLabel>
                                {
                                    listaTornei.slice(1).map((torneo) => (
                                        <SelectItem
                                            key={torneo.id}
                                            value={torneo.id.toString()}
                                        >
                                            {torneo.nome}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )
            }
            <ToggleGroup
                variant="outline"
                type="single"
                size="sm"
                defaultValue={showAsSilhouette ? "viewSilhouette" : "viewText"}
                onValueChange={(v) => {
                    setShowAsSilhouette(v === "viewSilhouette");
                }}
            >
                <ToggleGroupItem value="viewText" aria-label="Come testo">
                    <TextIcon/>
                </ToggleGroupItem>
                <ToggleGroupItem value="viewSilhouette" aria-label="Come immagini">
                    <UserIcon/>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}