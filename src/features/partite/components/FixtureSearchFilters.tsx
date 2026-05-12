import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";

import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

interface FixtureSearchFiltersProps {
    loading?: boolean;
    pathname: string;
    torneoParamName: string;
    categoriaParamName: string;
    gironeParamName: string;
    edizioni: { id: number; nome: string }[];
    categorie: { id: string; nome: string }[];
    gironi: { girone: string }[];
}

export default function FixtureSearchFilters(
    {
        loading = false,
        pathname,
        torneoParamName,
        categoriaParamName,
        gironeParamName,
        edizioni,
        categorie,
        gironi,
    } : FixtureSearchFiltersProps
) {
    const router = useRouter();
    const hasInitialized = useRef(false);

    const [filtroEdizione, setFiltroEdizione] = useState<string>("");
    const [filtroCategoria, setFiltroCategoria] = useState<string>("");
    const [filtroGirone, setFiltroGirone] = useState<string>("");

    useEffect(() => {
        if (edizioni.length > 0 && !hasInitialized.current) {
            setFiltroEdizione(edizioni[0].id.toString());
            setFiltroCategoria("show-all-key");
            setFiltroGirone("show-all-key");

            hasInitialized.current = true;
        }
    }, [edizioni, categorie, gironi]);

    function handleFiltering() {
        const params = new URLSearchParams();

        params.set(torneoParamName, filtroEdizione);
        if (filtroCategoria !== "show-all-key") params.set(categoriaParamName, filtroCategoria);
        if (filtroGirone !== "show-all-key") params.set(gironeParamName, filtroGirone);

        router.push(`${pathname}?${params.toString()}`);
    }

    if (edizioni.length === 0 || loading) return;

    return (
        <div className={"flex flex-wrap items-end justify-start sm:justify-between mt-3 gap-2 md:gap-4"}>
            <div className={"flex flex-wrap items-center w-full sm:w-fit gap-4 sm:gap-3 md:gap-4 mb-4 sm:mb-0"}>
                {/* Edizione */}
                <div className={"w-full sm:w-40 md:w-48 lg:w-52"}>
                    <label className="text-sm font-medium mb-2 block">
                        Filtra per edizione:
                    </label>
                    <Select value={filtroEdizione} onValueChange={setFiltroEdizione}>
                        <SelectTrigger className="w-full max-w-full sm:max-w-48 lg:max-w-52 rounded-lg">
                            <SelectValue placeholder="Seleziona edizione" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectGroup>
                                {edizioni.map((edizione) => (
                                    <SelectItem
                                        key={edizione.id}
                                        value={edizione.id.toString()}
                                    >
                                        {edizione.nome}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <span className={"text-2xl font-medium text-chart-1 mt-7 hidden lg:block"}>&gt;</span>

                {/* Categoria */}
                <div className={"w-full sm:w-40 md:w-48 lg:w-52"}>
                    <label className="text-sm font-medium mb-2 block">
                        Filtra per categoria:
                    </label>
                    <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                        <SelectTrigger className="w-full max-w-full sm:max-w-48 lg:max-w-52 rounded-lg">
                            <SelectValue placeholder="Seleziona categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectGroup>
                                <SelectItem value="show-all-key">
                                    Mostra tutto
                                </SelectItem>
                                {categorie.map((categoria) => (
                                    <SelectItem
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.nome}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <span className={"text-2xl font-medium text-chart-1 mt-7 hidden lg:block"}>&gt;</span>

                {/* Girone */}
                <div className={"w-full sm:w-40 md:w-48 lg:w-52"}>
                    <label className="text-sm font-medium mb-2 block">
                        Filtra per girone:
                    </label>
                    <Select value={filtroGirone} onValueChange={setFiltroGirone}>
                        <SelectTrigger className="w-full max-w-full sm:max-w-48 lg:max-w-52 rounded-lg">
                            <SelectValue placeholder="Seleziona girone" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                            <SelectGroup>
                                <SelectItem value="show-all-key">
                                    Mostra tutto
                                </SelectItem>
                                {gironi.map((girone) => (
                                    <SelectItem
                                        key={girone.girone}
                                        value={girone.girone}
                                    >
                                        {girone.girone}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="button" className="w-full sm:w-fit" onClick={handleFiltering}>
                Applica
            </Button>
        </div>
    );
}