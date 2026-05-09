import {useState, useEffect, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {listaTorneiType} from "@/features/tornei/queries";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";

interface FormationYearFilterProps {
    loading?: boolean,
    pathname: string,
    idSquadra: number,
    squadraParamName: string,
    torneoParamName: string,
    listaTornei: listaTorneiType
}

export default function FormationYearFilter(
    {
        loading = false,
        pathname,
        idSquadra,
        squadraParamName,
        torneoParamName,
        listaTornei,
    }: FormationYearFilterProps
) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasInitialized = useRef(false);

    const [filtroTorneo, setFiltroTorneo] = useState<string>("");

    useEffect(() => {
        if (listaTornei && listaTornei.length > 0 && !hasInitialized.current) {
            const currentUrlVal = searchParams.get(torneoParamName);
            setFiltroTorneo(currentUrlVal || listaTornei[0].id.toString());
            hasInitialized.current = true;
        }
    }, [listaTornei, searchParams, torneoParamName]);

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
        <Select value={filtroTorneo} onValueChange={(val) => {
            setFiltroTorneo(val);

            const params = new URLSearchParams();
            params.set(squadraParamName, idSquadra.toString());
            params.set(torneoParamName, val);

            router.push(`${pathname}?${params.toString()}`);
        }}>
            <SelectTrigger className="w-full sm:w-fit rounded-lg">
                <SelectValue placeholder="Edizione torneo"/>
            </SelectTrigger>
            <SelectContent className={"bg-background"}>
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