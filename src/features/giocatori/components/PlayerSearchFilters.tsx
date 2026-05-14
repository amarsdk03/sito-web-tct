import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";

import {listaTorneiType} from "@/features/tornei/queries";

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {FilterIcon} from "lucide-react";

interface PlayerSearchFiltersProps {
    loading?: boolean,
    pathname: string,
    torneoParamName: string,
    listaTornei: listaTorneiType
}

export default function PlayerSearchFilters(
    {
        loading = false,
        pathname,
        torneoParamName,
        listaTornei,
    }: PlayerSearchFiltersProps
) {
    const router = useRouter();
    const hasInitialized = useRef(false);

    const [filtroTorneo, setFiltroTorneo] = useState<string>("");

    useEffect(() => {
        if (listaTornei && listaTornei.length > 0 && !hasInitialized.current) {
            setFiltroTorneo(listaTornei[0].id.toString());
            hasInitialized.current = true;
        }
    }, [listaTornei]);

    function handleFiltering() {
        if (!filtroTorneo) return;

        const params = new URLSearchParams();
        params.set(torneoParamName, filtroTorneo);

        router.push(`${pathname}?${params.toString()}`);
    }

    if (loading) return (
        <Button
            variant="outline"
            className="bg-secondary text-chart-3 hover:text-chart-2"
            aria-label="Filtra ricerca"
        >
            <Spinner/>
        </Button>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-secondary text-chart-3 hover:text-chart-2"
                    aria-label="Filtra ricerca"
                >
                    <FilterIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Filtra ricerca</DialogTitle>
                    <DialogDescription className="sr-only">Filtra ricerca</DialogDescription>
                </DialogHeader>

                <Field className="w-full">
                    <FieldLabel>
                        Edizione torneo:
                    </FieldLabel>
                    <Select value={filtroTorneo} onValueChange={setFiltroTorneo}>
                        <SelectTrigger className="w-full rounded-lg">
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
                    <FieldDescription>
                        NB: alcuni giocatori delle edizioni prima del 2025/2026 potrebbero non essere disponibili
                    </FieldDescription>
                </Field>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Annulla
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleFiltering}>
                        Applica
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}