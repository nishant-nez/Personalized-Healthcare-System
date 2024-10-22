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
import { IDiagnosisHistory } from "@/interfaces/IDiagnosisHistory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react"
import { Button } from "./ui/button";

const COLUMNS = [
    "ID",
    "Disease",
    "Symptoms",
    "Diagnosis Date",
    "Actions",
];

const DiagnosisHistoryTable = ({ diagnosis, setSelectedID, deleteHistory }: { diagnosis: IDiagnosisHistory[], setSelectedID: (id: number) => void, deleteHistory: () => void }) => {
    const getSeverityColor = (severity: number) => {
        const colors = [
            "md:bg-green-200 text-green-800",
            "md:bg-lime-200 text-lime-800",
            "md:bg-yellow-200 text-yellow-800",
            "md:bg-orange-200 text-orange-800",
            "md:bg-red-200 text-red-800",
        ]
        return colors[severity - 1] || colors[0]
    }

    return (
        <section className="min-h-screen container mx-auto p-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-3xl lg:text-4xl/none mt-4 mb-8">My Diagnosis History</h2>
            <div className="w-full mb-8 overflow-hidden rounded-lg">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {COLUMNS.map((column) => <TableHead key={column}>{column}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {diagnosis.map((data) => {
                                return (
                                    <TableRow key={data.id}>
                                        <TableCell>
                                            {data.id}
                                        </TableCell>
                                        <TableCell>
                                            {data.name}
                                        </TableCell>
                                        <TableCell>
                                            <ul>
                                                {Object.entries(data.symptoms).map(([symptom, severity]) => (
                                                    <li key={symptom} className="mb-1">
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                                                                Number(severity)
                                                            )}`}
                                                        >
                                                            {symptom} (Severity: {severity})
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(data.created_at).toDateString()}
                                        </TableCell>
                                        <TableCell >
                                            <div className="h-full flex justify-center gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        {/* <div className="py-2 px-3 text-sm font-medium text-center text-white bg-[#d9534f] rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
                                                            onClick={() => setSelectedID(data.id)}
                                                        >
                                                            Delete
                                                        </div> */}
                                                        <Button variant="ghost" size="icon" onClick={() => setSelectedID(data.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will delete the selected diagnosis.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={deleteHistory}>Continue</AlertDialogAction>
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
            </div>
        </section>
    );
}

export default DiagnosisHistoryTable;