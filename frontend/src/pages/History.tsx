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
            console.log(response.data)
            setHistory(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching hospitals`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching hospitals",
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
            const response = await axios.get(
                '/api/diseases/history/all/',
                config,
            );
            console.log(response.data)
            setHistory(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching hospitals`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching hospitals",
                });
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (access) fetchHistory();
    }, [access]);

    useEffect(() => {
        console.log('in use effect')
        if (selectedID) console.log(selectedID);
    }, [selectedID]);

    return (
        <>
            <div className="container mx-auto rounded-2xl">
                <DiagnosisHistoryTable diagnosis={history} setSelectedID={setSelectedID} />

                {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
            </div>
        </>
    );
}

export default History;