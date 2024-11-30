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
}>;

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    isLoading,
}: DataTable<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualFiltering: true,
    });

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup =>
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header =>
                                <TableHead key={header.id} style={{ width: `${header.getSize()}rem` }}>
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
                                        (isLoading && cell.column.columnDef.id !== "actions")
                                            ? <Skeleton className="w-[10ch] h-4 my-2 rounded-full"/>
                                            : cell.column.columnDef.cell,
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