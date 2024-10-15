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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

    return (
        <div className="w-full overflow-x-auto">
            <table className="sm:inline-table w-full flex flex-row justify-center overflow-hidden">
                <thead>
                    <tr className={`bg-[#222E3A]/[6%] flex flex-col sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0`}>
                        {COLUMNS.map((column) => <th key={column} className="py-3 px-5 text-left border border-b">{column}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-white">

                    {reminders.map((data) => {
                        return (
                            <tr key={data.id} className="flex flex-col sm:table-row mb-2 sm:mb-0">
                                <td className="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                                    {data.id}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                                    <Avatar>
                                        <AvatarImage src={data.image} />
                                        <AvatarFallback>MD</AvatarFallback>
                                    </Avatar>
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.medicine_name}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.dosage}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.instructions}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.reminder_time}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.reminder_type === 'weekly' && `Weekly (${data.day_of_week?.map((item) => item.weekday)})`}
                                    {data.reminder_type === 'daily' && `Daily`}
                                    {data.reminder_type === 'interval' && `Interval (Every ${data.interval_value} ${data.interval_type})`}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {new Date(data.start_date).toDateString()}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.end_date && new Date(data.end_date).toDateString()}
                                </td>
                                <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                    {data.is_active ? <Badge variant="default" className="bg-green-600 hover:bg-green-500">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}
                                </td>
                                <td className="px-4 py-3 border">
                                    <div className="h-full flex justify-center gap-2">
                                        <div
                                            className="py-2 px-3 text-sm font-medium text-center bg-white border-black border-[1px] rounded-lg cursor-pointer hover:bg-black hover:text-white focus:ring-4"
                                            onClick={() => {
                                                setSelectedID(data.id);
                                                if (data.is_active) modifyReminder('pause', data.id);
                                                else modifyReminder('resume', data.id);
                                            }}
                                        >
                                            {
                                                isLoading && selectedID === data.id && <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                            }
                                            {!isLoading && (data.is_active ? 'Pause' : 'Resume')}
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <div className="py-2 px-3 text-sm font-medium text-center text-white bg-[#d9534f] rounded-lg hover:bg-red-600 focus:ring-4"
                                                    onClick={() => {
                                                        setSelectedID(data.id);
                                                    }}
                                                >
                                                    {
                                                        isLoading && selectedID === data.id && <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                                    }
                                                    {!isLoading && 'Delete'}
                                                </div>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will delete the selected Reminder.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => { modifyReminder('delete', data.id) }}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default RemindersTable;