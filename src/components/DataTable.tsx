"use client";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table";
import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    flexRender
} from "@tanstack/react-table";
import { Skeleton } from "./ui/skeleton";

type DataTable<T> = Readonly<{
    columns: ColumnDef<T>[];
    data: T[];
    isLoading: boolean;
    pageCount: number;
}>;

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    isLoading,
    pageCount,
}: DataTable<T>) {
    const table = useReactTable({
        columns,
        data: isLoading ? new Array(pageCount).fill({}) : data,
        getCoreRowModel: getCoreRowModel(),
        manualFiltering: true,
        pageCount,
    });

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup =>
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header =>
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            )}
                        </TableRow>
                    )}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.map(row =>
                        <TableRow className="group" key={row.id}>
                            {row.getVisibleCells().map(cell =>
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        isLoading ? <Skeleton className="w-[10ch] h-4 my-2 rounded-full"/> : cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}