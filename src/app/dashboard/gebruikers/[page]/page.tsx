"use client";

import DataTable from "@/components/DataTable";
import { useEffect, useState, useTransition } from "react";
import { getUsers, deleteUser, updateUser } from "@/lib/actions";
import { useParams } from "next/navigation";
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
import { toast } from "@/hooks/use-toast";
import { useParam } from "@/hooks/use-param";

type Users = Awaited<ReturnType<typeof getUsers>>;

const PAGE_COUNT = 8;

export default function Gebruikers() {
    const params = useParams();
    const page = parseInt(String(params.page)) || 1;
    const [ filter, setFilter ] = useParam("filter");
    const [ isLoading, startTransition ] = useTransition();
    const [ data, setData ] = useState<Users>();

    const fetchUsers = () => {
        startTransition(async () => {
            try {
                setData(await getUsers(filter, page, PAGE_COUNT));
            } catch (error) {
                if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Er is iets mis gegaan.",
                        description: "We konden de gebruikers niet ophalen.",
                    });
                }
            }
        });
    }

    useEffect(fetchUsers, [ filter, page ]);

    const handleSearch = (formData: FormData) => {
        setFilter(formData.get("filter")?.toString());
    }

    return (
        <>
            <h1 className="text-3xl font-bold">Gebruikers</h1>
            <form className="flex gap-4" action={handleSearch}>
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
                                <Actions
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

type Actions = Readonly<{
    user: User;
    refresh?: () => void;
    isLoading: boolean;
}>;

function Actions({ user, refresh, isLoading }: Actions) {
    return (
        <div className="flex flex-wrap justify-end gap-1 transition-opacity duration-100 opacity-0 size-full group-hover:opacity-100">
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
                        <form className="contents" action={async formData => {
                            try {
                                await updateUser(user.id, {
                                    name: formData.get("name"),
                                    email: formData.get("email"),
                                    password: formData.get("password") || undefined,
                                    role: formData.get("role"),
                                });
                                toast({
                                    title: "Success!",
                                    description: "We hebben de gebruiker's informatie aangepast.",
                                });
                            } catch (error) {
                                if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Er is iets mis gegaan.",
                                        description: "We konden de gebruiker's informatie niet aanpassen.",
                                    });
                                }
                            } finally {
                                refresh?.();
                            }
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
                            <Button variant="destructive" onClick={async () => {
                                try {
                                    await deleteUser(user.id);
                                    toast({
                                        title: "Success!",
                                        description: "We hebben de gebruiker verwijdered.",
                                    });
                                } catch (error) {
                                    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                                        toast({
                                            variant: "destructive",
                                            title: "Uh oh! Er is iets mis gegaan.",
                                            description: "We konden de gebruiker niet verwijderen.",
                                        });
                                    }
                                } finally {
                                    refresh?.();
                                }
                            }}>Verwijder</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TooltipProvider>
        </div>
    );
}