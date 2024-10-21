import axios from "@/api/axios";
import DiagnosisHistoryTable from "@/components/DiagnosisHistoryTable";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { IDiagnosisHistory } from "@/interfaces/IDiagnosisHistory";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
// import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
// import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


const History = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<IDiagnosisHistory[]>([]);
    const [selectedID, setSelectedID] = useState<number | null>(null);
    const { access } = useAuth();
    const { toast } = useToast();

    const fetchHistory = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            const response = await axios.get(
                '/api/diseases/history/all/',
                config,
            );
            setHistory(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching diagnosis history`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching diagnosis history",
                });
            }
        }
        setIsLoading(false);
    };

    const deleteHistory = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            await axios.delete(
                `/api/diseases/history/${selectedID}/`,
                config,
            );
            toast({
                variant: "success",
                title: 'Diagnosis History Deleted Successfully',
            });
            setIsLoading(false);
            fetchHistory();
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error deleting history`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error deleting history",
                });
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (access) fetchHistory();
    }, [access]);

    return (
        <>
            <div className="container mx-auto rounded-2xl pt-24 min-h-screen">
                <DiagnosisHistoryTable diagnosis={history} setSelectedID={setSelectedID} deleteHistory={deleteHistory} />

                {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
            </div>
        </>
    );
}

export default History;