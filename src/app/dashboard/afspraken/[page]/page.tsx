"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useParams } from "next/navigation";
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
import { toast } from "@/hooks/use-toast";
import { useParam } from "@/hooks/use-param";

type Appointments = Awaited<ReturnType<typeof getAppointments>>;

const PAGE_COUNT = 8;

export default function Afspraken() {
    const params = useParams();
    const page = parseInt(String(params.page)) || 1;
    const [ filter, setFilter ] = useParam("filter");
    const [ isLoading, startTransition ] = useTransition();
    const [ data, setData ] = useState<Appointments>();

    const fetchAfspraken = () => {
        startTransition(async () => {
            try {
                setData(await getAppointments(filter, page, PAGE_COUNT));
            } catch (error) {
                if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Er is iets mis gegaan.",
                        description: "We konden de afspraken niet ophalen.",
                    });
                }
            }
        });
    }

    useEffect(fetchAfspraken, [ filter, page ]);

    const handleSearch = (formData: FormData) => {
        setFilter(formData.get("filter")?.toString());
    }

    return (
        <>
            <h1 className="text-3xl font-bold">Afspraken</h1>
            <form className="flex gap-4" action={handleSearch}>
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
                            accessorKey: "date",
                            header: "Datum",
                        },
                        {
                            accessorFn: ({ time }) => time.slice(0,5),
                            header: "Tijd",
                        },
                        {
                            accessorKey: "quantity",
                            header: "Aantal",
                        },
                        {
                            accessorKey: "size",
                            header: "Formaat",
                        },
                        {
                            accessorFn: ({ doublesided }) => doublesided ? "Ja" : "Nee",
                            header: "Dubbelzijdig",
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
                                <Actions
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
    quantity: number,
    doublesided: boolean,
    size: string,
    user: {
        id: number;
        name: string;
    };
}

type Actions = Readonly<{
    appointment: Appointment;
    refresh?: () => void;
    isLoading: boolean;
}>;

function Actions({ appointment, refresh, isLoading }: Actions) {
    const date = useRef(appointment.date
        ? new Date(appointment.date)
        : new Date()
    );
    const [times, setTimes] = useState<string[]>();
    const [timesLoading, startTransition] = useTransition();
    const isAppointmentDate = date.current?.toLocaleDateString("en-CA") === appointment.date;

    function updateTimes() {
        startTransition(async () => {
            try {
                setTimes(await getAppointmentTimes(date.current!, new Date()));
            } catch (error) {
                if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Er is iets mis gegaan.",
                        description: "We konden de beschikbare afspraak tijden niet ophalen.",
                    });
                }
            }
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
                        <form className="contents" action={async formData => {
                            try {
                                formData.set("date", date.current?.toLocaleDateString("en-CA") ?? appointment.date)
                                await updateAppointment(appointment.id, formData);
                                toast({
                                    title: "Success!",
                                    description: "We hebben de afspraak aangepast.",
                                });
                            } catch (error) {
                                if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Er is iets mis gegaan.",
                                        description: "We konden de afspraak niet aanpassen.",
                                    });
                                }
                            } finally {
                                refresh?.();
                            }
                        }}>
                            <div className="space-y-2">
                                <Label htmlFor="user-id">Gebruiker ID</Label>
                                <Input id="user-id" name="user" type="number" defaultValue={appointment.user?.id} required/>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="space-y-2 flex-1 basis-32">
                                    <Label htmlFor="quantity" className="block">Aantal</Label>
                                    <Input defaultValue={appointment.quantity} min="1" max="10000" name="quantity" id="quantity" type="number" required/>
                                </div>
                                <div className="space-y-2 flex-1 basis-32">
                                    <Label htmlFor="doublesided" className="block">Dubbelzijdig</Label>
                                    <Select name="doublesided" defaultValue={appointment.doublesided ? "true" : "false"} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer een waarde"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="false">Nee</SelectItem>
                                            <SelectItem value="true">Ja</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex-1 basis-32">
                                    <Label htmlFor="size" className="block">Formaat</Label>
                                    <Select name="size" defaultValue={appointment.size} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer een waarde"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A0">A0 <small>(841 x 1189 mm)</small></SelectItem>
                                            <SelectItem value="A1">A1 <small>(594 x 841 mm)</small></SelectItem>
                                            <SelectItem value="A2">A2 <small>(420 x 594 mm)</small></SelectItem>
                                            <SelectItem value="A3">A3 <small>(297 x 420 mm)</small></SelectItem>
                                            <SelectItem value="A4">A4 <small>(297 x 210 mm)</small></SelectItem>
                                            <SelectItem value="A5">A5 <small>(148 x 210 mm)</small></SelectItem>
                                            <SelectItem value="A6">A6 <small>(105 x 148 mm)</small></SelectItem>
                                            <SelectItem value="A7">A7 <small>(74 x 105 mm)</small></SelectItem>
                                            <SelectItem value="A8">A8 <small>(52 x 72 mm)</small></SelectItem>
                                            <SelectItem value="A9">A9 <small>(37 x 52 mm)</small></SelectItem>
                                            <SelectItem value="A10">A10 <small>(26 x 37 mm)</small></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 space-y-2">
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
                                <div className="flex-1 space-y-2">
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
                            <Button variant="destructive" onClick={async () => {
                                try {
                                    await deleteAppointment(appointment.id);
                                    toast({
                                        title: "Success!",
                                        description: "We hebben de afspraak verwijdered.",
                                    });
                                } catch (error) {
                                    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                                        toast({
                                            variant: "destructive",
                                            title: "Uh oh! Er is iets mis gegaan.",
                                            description: "We konden de afspraak niet verwijderen.",
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