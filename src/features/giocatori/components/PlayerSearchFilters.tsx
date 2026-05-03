import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {sampleSquadre} from "@/sampleData/squadre";

interface MatchResultFiltersProps {
    edizione?: string;
    categoria?: string;
    giornata?: string;
}

export default function PlayerSearchFilters(
    { edizione, categoria, giornata } : MatchResultFiltersProps)
{
    const selectEdizione = "2025/2026";
    const selectCategoria = "Tesserati";
    const selectGiornata = "1";

    return (
        <div className={"w-full flex flex-row flex-wrap items-center gap-2 mb-4"}>
            <Select>
                <SelectTrigger className="w-48 rounded-lg">
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
            <Select>
                <SelectTrigger className="w-48 rounded-lg">
                    <SelectValue placeholder="Squadra" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={"bg-background"}>
                        <SelectLabel>Squadra</SelectLabel>
                        {
                            sampleSquadre.map((squadra) => (
                                <SelectItem
                                    key={squadra.id}
                                    value={squadra.id}
                                >
                                    {squadra.nome}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}