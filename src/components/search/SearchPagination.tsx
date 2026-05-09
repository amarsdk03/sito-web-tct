import {ReadonlyURLSearchParams} from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchPaginationProps {
    pathname: string;
    searchParams: ReadonlyURLSearchParams;
    pageParamName: string;
    totalResults: number;
    resultsPerPage: number;
    currentPage: number;
}

const maxPaginationWidth = 5;

function paginationItems(currentPage: number, maxPage: number) {
    // If we have fewer total pages than our desired size, just show all of them
    if (maxPage <= maxPaginationWidth) {
        return Array.from({ length: maxPage }, (_, i) => i + 1);
    }

    // Logic for the "sliding window"
    let start = currentPage - 2;
    let end = currentPage + 2;

    // Adjust if we are too close to the beginning
    if (start < 1) {
        start = 1;
        end = maxPaginationWidth;
    }

    // Adjust if we are too close to the end
    if (end > maxPage) {
        end = maxPage;
        start = maxPage - (maxPaginationWidth - 1);
    }

    return Array.from({ length: (end - start) + 1 }, (_, i) => start + i);
}

export function SearchPagination({
    pathname,
    searchParams,
    pageParamName,
    totalResults,
    resultsPerPage,
    currentPage,
} : SearchPaginationProps) {
    if (resultsPerPage <= 0 || resultsPerPage > totalResults) {
        return null;
    }

    const maxPage = Math.ceil(totalResults / resultsPerPage);
    const pageItems = paginationItems(currentPage, maxPage);

    function buildHref(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set(pageParamName, page.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <Pagination>
            <PaginationContent>
                {
                    currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href={buildHref(currentPage - 1)} text={"Indietro"} />
                        </PaginationItem>
                    )
                }
                {
                    pageItems[0] > 1 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )
                }
                {
                    pageItems.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink href={buildHref(page)} isActive={page === currentPage}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                }
                {
                    pageItems[pageItems.length - 1] < maxPage && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )
                }
                {
                    currentPage < maxPage && (
                        <PaginationItem>
                            <PaginationNext href={buildHref(currentPage + 1)} text={"Avanti"} />
                        </PaginationItem>
                    )
                }
            </PaginationContent>
        </Pagination>
    )
}
