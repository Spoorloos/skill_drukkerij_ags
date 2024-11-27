"use client";

import DataTable from "@/components/DataTable";
import { useEffect, useState, useTransition } from "react";
import { getUsers, deleteUser } from "@/lib/actions";
import { User } from "next-auth";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gebruikers() {
    const [ users, setUsers ] = useState<User[]>();
    const [ error, setError ] = useState<boolean>();
    const [ isLoading, startTransition ] = useTransition();

    const fetchUsers = () => {
        startTransition(async () => {
            const data = await getUsers();
            setUsers(data?.data ?? undefined);
            setError(!!data?.error?.message);
        });
    }

    useEffect(fetchUsers, []);

    return (
        <>
            <h1 className="text-3xl font-bold">Gebruikers</h1>
            {isLoading ? <>
                <small className="block italic">Aan het laden...</small>
            </> : error ? <>
                <strong>Er is een probleem opgetreden</strong>
            </> : users && <>
                <DataTable data={users} columns={[
                    {
                        accessorKey: "id",
                        header: "ID",
                    },
                    {
                        accessorKey: "name",
                        header: "Naam",
                    },
                    {
                        accessorKey: "email",
                        header: "Email",
                    },
                    {
                        accessorKey: "role",
                        header: "Rol",
                    },
                    {
                        id: "actions",
                        enableHiding: true,
                        cell: ({ row }) => <ActionDropdown user={row.original} refresh={fetchUsers}/>
                    }
                ]}/>
            </>}
        </>
    );
}

type ActionDropdown = Readonly<{
    user: User;
    refresh?: Function,
}>;

function ActionDropdown({ user, refresh }: ActionDropdown) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="size-full text-end">
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Ellipsis/>
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => {
                        deleteUser(user.id);
                        refresh?.();
                    }}
                >Delete user</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}