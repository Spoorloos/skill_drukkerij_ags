"use client";

import DataTable from "@/components/DataTable";
import { useEffect, useState, useTransition } from "react";
import { getUsers, deleteUser, updateUser } from "@/lib/actions";
import { useParams, useSearchParams } from "next/navigation";
import { type User } from "next-auth";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

const PAGE_COUNT = 8;

export default function Gebruikers() {
    const params = useParams();
    const searchParams = useSearchParams();
    const page = parseInt(String(params.page)) || 1;
    const filter = searchParams.get("filter") || undefined;

    const [ isLoading, startTransition ] = useTransition();
    const [ data, setData ] = useState<Awaited<ReturnType<typeof getUsers>>>();

    const fetchUsers = () => {
        startTransition(async () => {
            setData(await getUsers(filter, page, PAGE_COUNT));
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
            {data?.error ? <>
                <strong className="block">Er is een probleem opgetreden</strong>
            </> : <>
                <DataTable
                    isLoading={isLoading || !data?.data}
                    data={data?.data || new Array(PAGE_COUNT).fill({})}
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
                        {
                            id: "actions",
                            enableHiding: true,
                            enableResizing: false,
                            cell: ({ row }) => (
                                <ActionDropdown
                                    user={row.original}
                                    refresh={fetchUsers}
                                    isLoading={isLoading || !data?.data}
                                />
                            )
                        },
                    ]}
                />
                {!data?.count ? undefined :
                    <TablePagination
                        link="/dashboard/gebruikers"
                        page={page}
                        count={Math.ceil(data.count / PAGE_COUNT)}
                    />
                }
            </>}
        </>
    );
}

type ActionDropdown = Readonly<{
    user: User;
    refresh?: () => void;
    isLoading: boolean;
}>;

function ActionDropdown({ user, refresh, isLoading }: ActionDropdown) {
    return (
        <div className="space-x-2 transition-opacity duration-100 opacity-0 size-full text-end group-hover:opacity-100">
            <TooltipProvider
                delayDuration={700}
                skipDelayDuration={50}
                disableHoverableContent
            >
                <Dialog>
                    <Tooltip>
                        <TooltipContent>Aanpassen</TooltipContent>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0" disabled={isLoading}>
                                    <Edit/>
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                    </Tooltip>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Gebruiker aanpassen</DialogTitle>
                            <DialogDescription>Maak aanpassingen aan een gebruiker's informatie en klik op opslaan als je klaar bent.</DialogDescription>
                        </DialogHeader>
                        <form className="contents" action={formData => {
                            updateUser(user.id, {
                                name: formData.get("name"),
                                email: formData.get("email"),
                                password: formData.get("password") || undefined,
                                role: formData.get("role"),
                            }).then(refresh);
                        }}>
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
                                <DialogClose asChild>
                                    <Button variant="secondary">Annuleren</Button>
                                </DialogClose>
                                <Button type="submit">Aanpassen</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <Tooltip>
                        <TooltipContent>Verwijderen</TooltipContent>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-8 h-8 p-0" disabled={isLoading}>
                                    <Trash2 className="text-red-500"/>
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                    </Tooltip>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Gebruiker verwijderen?</DialogTitle>
                            <DialogDescription>Weet je zeker dat je deze gebruiker wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Annuleren</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => deleteUser(user.id).then(refresh)}>Verwijder</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TooltipProvider>
        </div>
    );
}