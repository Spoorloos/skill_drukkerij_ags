"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    getAppointments,
    deleteAppointment,
    getAppointmentTimes,
    updateAppointment
} from "@/lib/actions";
import DataTable from "@/components/DataTable";
import TablePagination from "@/components/TablePagination";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
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
import { Edit, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/ui/datepicker";
import { Textarea } from "@/components/ui/textarea";

const PAGE_COUNT = 8;

export default function Afspraken() {
    const params = useParams();
    const searchParams = useSearchParams();
    const page = parseInt(String(params.page)) || 1;
    const filter = searchParams.get("filter") || undefined;

    const [ isLoading, startTransition ] = useTransition();
    const [ data, setData ] = useState<Awaited<ReturnType<typeof getAppointments>>>();

    const fetchAfspraken = () => {
        startTransition(async () => {
            setData(await getAppointments(filter, page, PAGE_COUNT));
        });
    }

    useEffect(fetchAfspraken, [ filter, page ]);

    return (
        <>
            <h1 className="text-3xl font-bold">Afspraken</h1>
            <form className="flex gap-4" action="/dashboard/afspraken">
                <Input className="max-w-sm" placeholder="Filter op gebruiker naam" name="filter" defaultValue={filter}/>
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
                            accessorFn: ({ user }) => user.name,
                            header: "Gebruiker",
                        },
                        {
                            accessorFn: ({ time }) => time.slice(0,5),
                            header: "Tijd",
                        },
                        {
                            accessorKey: "date",
                            header: "Datum",
                        },
                        {
                            accessorFn: ({ description }) => {
                                return description.length > 50
                                    ? description.slice(0, 50) + "..."
                                    : description
                            },
                            header: "Beschrijving",
                        },
                        {
                            id: "actions",
                            enableHiding: true,
                            enableResizing: false,
                            cell: ({ row }) => (
                                <ActionDropdown
                                    appointment={row.original}
                                    refresh={fetchAfspraken}
                                    isLoading={isLoading || !data?.data}
                                />
                            )
                        },
                    ]}
                />
                {!data?.count ? undefined :
                    <TablePagination
                        link="/dashboard/afspraken"
                        page={page}
                        count={Math.ceil(data.count / PAGE_COUNT)}
                    />
                }
            </>}
        </>
    );
}

type Appointment = {
    id: number;
    date: string;
    time: string;
    description: string;
    user: {
        id: number;
        name: string;
    };
}

type ActionDropdown = Readonly<{
    appointment: Appointment;
    refresh?: () => void;
    isLoading: boolean;
}>;

function ActionDropdown({ appointment, refresh, isLoading }: ActionDropdown) {
    const date = useRef(appointment.date
        ? new Date(appointment.date)
        : new Date()
    );
    const [times, setTimes] = useState<string[]>();
    const [timesLoading, startTransition] = useTransition();
    const isAppointmentDate = date.current?.toLocaleDateString("en-CA") === appointment.date;

    function updateTimes() {
        startTransition(async () => {
            setTimes(await getAppointmentTimes(date.current!, new Date()));
        });
    }

    return (
        <div className="flex flex-wrap justify-end gap-1 transition-opacity duration-100 opacity-0 size-full group-hover:opacity-100">
            <TooltipProvider
                delayDuration={700}
                skipDelayDuration={50}
                disableHoverableContent
            >
                <Dialog onOpenChange={(open) => {
                    if (open && date.current) updateTimes();
                }}>
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
                            <DialogTitle>Afspraak aanpassen</DialogTitle>
                            <DialogDescription>Maak aanpassingen aan een afspraak en klik op opslaan als je klaar bent.</DialogDescription>
                        </DialogHeader>
                        <form className="contents" action={formData => {
                            updateAppointment(appointment.id, {
                                user: formData.has("user") ? parseInt(formData.get("user")!.toString()) : appointment.user,
                                date: date.current?.toLocaleDateString("en-CA") ?? appointment.date,
                                time: formData.get("time") ?? appointment.time,
                                description: formData.get("description") ?? appointment.description,
                            }).then(refresh);
                        }}>
                            <div className="space-y-2">
                                <Label htmlFor="user-id">Gebruiker ID</Label>
                                <Input id="user-id" name="user" type="number" defaultValue={appointment.user?.id} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Datum</Label>
                                <DatePicker
                                    required
                                    mode="single"
                                    selected={date.current}
                                    fromDate={new Date()}
                                    onSelect={(newDate: Date | undefined) => {
                                        if (newDate) {
                                            date.current = newDate;
                                            updateTimes();
                                        }
                                    }}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Tijd</Label>
                                {(timesLoading || !times) ? (
                                    <Skeleton className="block w-full h-9"/>
                                ) : (
                                    <Select name="time" disabled={times.length < 1} defaultValue={isAppointmentDate ? appointment.time : undefined} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder={times.length < 1
                                                ? "Geen tijden op deze dag"
                                                : "Selecteer een tijd"
                                            }/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isAppointmentDate &&
                                                <SelectItem value={appointment.time} disabled>{appointment.time?.slice(0, 5)}</SelectItem>
                                            }
                                            {times.map((time, index) =>
                                                <SelectItem value={time} key={index}>{time.slice(0,5)}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea id="description" name="description" defaultValue={appointment.description} maxLength={1000} required/>
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
                            <DialogTitle>Afspraak verwijderen?</DialogTitle>
                            <DialogDescription>Weet je zeker dat je deze afspraak wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Annuleren</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => deleteAppointment(appointment.id).then(refresh)}>Verwijder</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TooltipProvider>
        </div>
    );
}