import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Pagination as ShadcnPagination,
} from './ui/pagination';

import { router } from '@inertiajs/react';

interface PaginationLinkType {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLinkType[];
}

const Pagination = ({ links }: Props) => {
    if (!links || links.length <= 3) return null;

    const currentPage = parseInt(links.find((link) => link.active)?.label || '1');

    return (
        <div className="mt-4">
            <ShadcnPagination>
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => {
                                const prevUrl = links[0].url;
                                if (prevUrl) {
                                    router.visit(prevUrl, { preserveScroll: true, preserveState: true });
                                }
                            }}
                        />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {links.slice(1, -1).map((link, index) => {
                        const pageNumber = parseInt(link.label);
                        const isNumber = !isNaN(pageNumber);
                        const shouldDisplay = isNumber && pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2;
                        const showEllipsis = (index === 1 || index === links.length - 3) && !shouldDisplay;

                        if (showEllipsis) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        if (shouldDisplay) {
                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        className="cursor-pointer"
                                        isActive={link.active}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url, { preserveScroll: true, preserveState: true });
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }

                        return null;
                    })}

                    {/* Next */}
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => {
                                const nextUrl = links[links.length - 1]?.url;
                                if (nextUrl) {
                                    router.visit(nextUrl, { preserveScroll: true, preserveState: true });
                                }
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </ShadcnPagination>
        </div>
    );
};

export default Pagination;
