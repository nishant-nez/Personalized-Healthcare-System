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
} from "@/components/ui/alert-dialog"
import { IDiagnosisHistory } from "@/interfaces/IDiagnosisHistory";

const COLUMNS = [
    "ID",
    "Disease",
    "Symptoms",
    "Diagnosis Date",
    "Actions",
];

const DiagnosisHistoryTable = ({ diagnosis, setSelectedID, deleteHistory }: { diagnosis: IDiagnosisHistory[], setSelectedID: (id: number) => void, deleteHistory: () => void }) => {
    return (
        <section className="min-h-screen container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mt-4 mb-8">My Diagnosis History</h2>
            <div className="w-full mb-8 overflow-hidden rounded-lg">
                <div className="w-full overflow-x-auto">
                    <table className="sm:inline-table w-full flex flex-row justify-center overflow-hidden">
                        <thead>
                            <tr className={`bg-[#222E3A]/[6%] flex flex-col sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0`}>
                                {COLUMNS.map((column) => <th key={column} className="py-3 px-5 text-left border border-b">{column}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-white">

                            {diagnosis.map((data) => {
                                return (
                                    <tr key={data.id} className="flex flex-col sm:table-row mb-2 sm:mb-0">
                                        <td className="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                                            {data.id}
                                        </td>
                                        <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                            {data.name}
                                        </td>
                                        <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5 flex gap-3 flex-wrap">
                                            {
                                                Object.entries(data.symptoms).map(([key, value]) => {
                                                    if (Number(value) === 1) return <div key={key} className="bg-green-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                                    if (Number(value) === 2) return <div key={key} className="bg-blue-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                                    if (Number(value) === 3) return <div key={key} className="bg-yellow-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                                    if (Number(value) === 4) return <div key={key} className="bg-orange-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                                    if (Number(value) === 5) return <div key={key} className="bg-red-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                                })
                                            }
                                        </td>
                                        <td className="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5">
                                            {new Date(data.created_at).toDateString()}
                                        </td>
                                        <td className="px-4 py-3 border">
                                            <div className="h-full flex justify-center gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <div className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                                                            onClick={() => setSelectedID(data.id)}
                                                        >
                                                            Delete
                                                        </div>
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
                                        </td>
                                    </tr>
                                )
                            })}



                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default DiagnosisHistoryTable;