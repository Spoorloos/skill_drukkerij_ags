import { getPages } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type TablePagination = Readonly<{
    link: string;
    page: number;
    count: number;
}>;

export default function TablePagination({ link, page, count }: TablePagination) {
    const searchParams = useSearchParams();
    const pages = getPages(page, count);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className={page <= 1 ? "invisible" : undefined}>
                    <PaginationPrevious href={`${link}/${page - 1}?${searchParams}`}/>
                </PaginationItem>
                {pages.map(x =>
                    <PaginationLink
                        href={`${link}/${x}?${searchParams}`}
                        isActive={x === page}
                        key={x}
                    >{x}</PaginationLink>
                )}
                <PaginationItem className={page >= count ? "invisible" : undefined}>
                    <PaginationNext href={`${link}/${page + 1}?${searchParams}`}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}