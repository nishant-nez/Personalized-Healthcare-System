import { IReminder } from "@/interfaces/IReminder";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Pause, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "./ui/button";

const COLUMNS = [
    "ID",
    "Image",
    "Medicine",
    "Dosage",
    "Instructions",
    "Time",
    "Repeat",
    "Start Date",
    "End Date",
    "Status",
    "Actions",
];

const RemindersTable = (
    {
        reminders,
        selectedID,
        setSelectedID,
        modifyReminder,
        isLoading,
    }:
        {
            reminders: IReminder[],
            selectedID: number | null,
            setSelectedID: (id: number) => void,
            modifyReminder: (action: string, id: number) => void,
            isLoading: boolean,
        }
) => {

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {COLUMNS.map((column) => <TableHead key={column}>{column}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {reminders.map((data) => {
                        return (
                            <TableRow key={data.id}>
                                <TableCell>
                                    {data.id}
                                </TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={data.image} />
                                        <AvatarFallback>MD</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell >
                                    {data.medicine_name}
                                </TableCell>
                                <TableCell >
                                    {data.dosage}
                                </TableCell>
                                <TableCell >
                                    {data.instructions}
                                </TableCell>
                                <TableCell >
                                    {data.reminder_time}
                                </TableCell>
                                <TableCell >
                                    {data.reminder_type === 'weekly' && Array.isArray(data.day_of_week) && `Weekly (${data.day_of_week.map((item: { weekday: string }) => item.weekday)})`}
                                    {data.reminder_type === 'daily' && `Daily`}
                                    {data.reminder_type === 'interval' && `Interval (Every ${data.interval_value} ${data.interval_type})`}
                                </TableCell>
                                <TableCell >
                                    {new Date(data.start_date).toDateString()}
                                </TableCell>
                                <TableCell >
                                    {data.end_date && new Date(data.end_date).toDateString()}
                                </TableCell>
                                <TableCell >
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${data.is_active
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {data.is_active ? 'active' : 'inactive'}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <div className="h-full flex justify-center gap-2">
                                        {/* pause / resume */}
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (data.id !== undefined) {
                                                    setSelectedID(data.id);
                                                }
                                                if (data.id !== undefined) {
                                                    if (data.is_active) modifyReminder('pause', data.id);
                                                    else modifyReminder('resume', data.id);
                                                }
                                            }}
                                        >
                                            {
                                                isLoading && selectedID === data.id && <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                            }
                                            {!isLoading && (data.is_active
                                                ?
                                                <>
                                                    <Pause className="w-4 h-4 mr-1" />
                                                    Pause
                                                </>
                                                :
                                                <>
                                                    <Play className="w-4 h-4 mr-1" />
                                                    Resume
                                                </>
                                            )}
                                        </Button>
                                        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                                            {/* <AlertDialogTrigger> */}
                                            <Button
                                                variant="destructive"
                                                // size="sm"
                                                onClick={() => {
                                                    if (data.id !== undefined) {
                                                        setSelectedID(data.id);
                                                        setAlertOpen(true);
                                                    }
                                                }}
                                            >
                                                {
                                                    isLoading && selectedID === data.id && <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                                }
                                                {!isLoading && <><Trash2 className="w-4 h-4 mr-1" /> Delete</>}
                                            </Button>
                                            {/* </AlertDialogTrigger> */}
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will delete the selected Reminder.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => { if (data.id !== undefined) modifyReminder('delete', data.id) }}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default RemindersTable;