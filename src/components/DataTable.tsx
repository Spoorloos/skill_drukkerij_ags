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
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

type DataTable<T> = Readonly<{
    columns: ColumnDef<T>[];
    data: T[];
}>;

export default function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
}: DataTable<T>) {
    const [filter, setFilter] = useState<string>("");
    const filteredData = useMemo(() => data.filter(row => {
        return Object
            .values(row)
            .some(value => String(value).includes(filter));
    }), [filter]);

    const table = useReactTable({
        columns,
        data: filteredData,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Input className="max-w-sm" placeholder="Filter rijen" onChange={e => setFilter(e.target.value)}/>
            <div className="rounded-md border">
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
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell =>
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}