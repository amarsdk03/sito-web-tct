import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MatchResultFiltersProps {
    edizione?: string;
    categoria?: string;
    giornata?: string;
}

export default function FixtureSearchFilters(
    { edizione, categoria, giornata } : MatchResultFiltersProps)
{
    const selectEdizione = "2025/2026";
    const selectCategoria = "Tesserati";
    const selectGiornata = "1";

    return (
        <div className={"flex flex-wrap items-center gap-2 mb-4"}>
            <Select defaultValue={"2025/2026"}>
                <SelectTrigger className="w-full max-w-full sm:max-w-48 rounded-lg">
                    <SelectValue placeholder="Edizione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={"bg-background"}>
                        <SelectLabel>Edizione torneo</SelectLabel>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                        <SelectItem value="2024/2025" disabled>2024/2025 (in arrivo...)</SelectItem>
                        <SelectItem value="2023/2024" disabled>2023/2024 (in arrivo...)</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <span className={"text-2xl font-medium text-chart-1 mx-1 hidden md:block"}>&gt;</span>
            <Select defaultValue={"amatori"}>
                <SelectTrigger className="w-full max-w-full sm:max-w-48 rounded-lg">
                    <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={"bg-background"}>
                        <SelectLabel>Categoria squadre</SelectLabel>
                        <SelectItem value="tesserati">Tesserati</SelectItem>
                        <SelectItem value="amatori">Amatori</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <span className={"text-2xl font-medium text-chart-1 mx-1 hidden md:block"}>&gt;</span>
            <Select>
                <SelectTrigger className="w-full max-w-full sm:max-w-48 rounded-lg">
                    <SelectValue placeholder="Giornata" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={"bg-background"}>
                        <SelectLabel>Giornata campionato</SelectLabel>
                        <SelectItem value="1">Giornata 1</SelectItem>
                        <SelectItem value="2">Giornata 2</SelectItem>
                        <SelectItem value="3">Giornata 3</SelectItem>
                        <SelectItem value="4">Giornata 4</SelectItem>
                        <SelectItem value="5">Giornata 5</SelectItem>
                        <SelectItem value="6">Giornata 6</SelectItem>
                        <SelectItem value="7">Giornata 7</SelectItem>
                        <SelectItem value="8">Giornata 8</SelectItem>
                        <SelectItem value="9">Giornata 9</SelectItem>
                        <SelectItem value="10">Giornata 10</SelectItem>
                        <SelectItem value="11">Giornata 11</SelectItem>
                        <SelectItem value="12">Giornata 2</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}