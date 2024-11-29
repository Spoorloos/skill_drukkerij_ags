"use client";

import DataTable from "@/components/DataTable";
import { useEffect, useState, useTransition } from "react";
import { getUsers, deleteUser, updateUser } from "@/lib/actions";
import { useParams, useSearchParams } from "next/navigation";
import { User } from "next-auth";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/TablePagination";

const PAGE_COUNT = 8;

export default function Gebruikers() {
    const params = useParams();
    const searchParams = useSearchParams();
    const page = parseInt(String(params.page)) || 1;
    const filter = searchParams.get("filter") || undefined;

    const [ users, setUsers ] = useState<User[]>();
    const [ error, setError ] = useState<boolean>();
    const [ count, setCount ] = useState<number>();
    const [ isLoading, startTransition ] = useTransition();

    const fetchUsers = () => {
        startTransition(async () => {
            const data = await getUsers(filter, page, PAGE_COUNT);
            setUsers(data?.data ?? undefined);
            setError(!!data?.error?.message);
            setCount(data?.count ?? undefined);
        });
    }

    useEffect(fetchUsers, [ filter, page ]);

    return (
        <>
            <h1 className="text-3xl font-bold">Gebruikers</h1>
            <form className="flex gap-4" action="/dashboard/gebruikers">
                <Input className="max-w-sm" placeholder="Filter op naam en email" name="filter" defaultValue={filter}/>
                <Button type="submit">Filter</Button>
            </form>
            {error ? <>
                <strong>Er is een probleem opgetreden</strong>
            </> : <>
                <DataTable
                    isLoading={isLoading || !users}
                    pageCount={PAGE_COUNT}
                    data={users!}
                    columns={[
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
                        ...(isLoading || !users) ? [] : [{
                            id: "actions",
                            enableHiding: true,
                            cell: ({ row }: any) => <ActionDropdown user={row.original} refresh={fetchUsers}/>
                        }]
                    ]}
                />
                {!count ? undefined :
                    <TablePagination
                        link="/dashboard/gebruikers"
                        page={page}
                        count={Math.ceil(count / PAGE_COUNT)}
                    />
                }
            </>}
        </>
    );
}

type ActionDropdown = Readonly<{
    user: User;
    refresh?: Function;
}>;

function ActionDropdown({ user, refresh }: ActionDropdown) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="size-full text-end">
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <Ellipsis/>
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <EditDialog user={user} refresh={refresh}>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>Aanpassen</DropdownMenuItem>
                </EditDialog>
                <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => {
                        deleteUser(user.id);
                        refresh?.();
                    }}
                >Verwijder</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

type EditDialog = Readonly<{
    children: React.ReactNode;
    user: User;
    refresh?: Function;
}>;

function EditDialog({ children, user, refresh }: EditDialog) {
    const formAction = async (formData: FormData) => {
        await updateUser(user.id, {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password") || undefined,
            role: formData.get("role"),
        });
        refresh?.();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gebruiker aanpassen</DialogTitle>
                    <DialogDescription>Maak aanpassingen aan een gebruiker's informatie en klik op opslaan als je klaar bent.</DialogDescription>
                </DialogHeader>
                <form className="contents" action={formAction}>
                    <div className="space-y-2">
                        <Label htmlFor="user-name">Naam</Label>
                        <Input id="user-name" name="name" defaultValue={user.name} minLength={5} maxLength={50} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" name="email" type="email" defaultValue={user.email} minLength={5} maxLength={75} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="user-password">Wachtwoord</Label>
                        <Input id="user-password" name="password" placeholder="wachtwoord123" minLength={8} maxLength={50}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Rol</Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger>
                                <SelectValue defaultValue={user.role}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Gebruiker">Gebruiker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Opslaan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}