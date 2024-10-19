import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { IReminder } from "@/interfaces/IReminder";
import { Loader2, History } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { AxiosError } from "axios";
import RemindersTable from "@/components/RemindersTable";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ReminderAddForm from "@/components/ReminderAddForm";
import { Button } from "@/components/ui/button";
import HistoryDrawer from "./HistoryDrawer";


const MedicineReminders = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modifyLoading, setModifyLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [reminders, setReminders] = useState<IReminder[]>([]);
    const [selectedID, setSelectedID] = useState<number | null>(null);
    const { access } = useAuth();
    const { toast } = useToast();

    const fetchReminders = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            const response = await axios.get(
                '/api/medicine-reminder/',
                config,
            );
            setReminders(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching reminders`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching reminders",
                });
            }
        }
        setIsLoading(false);
    };

    const modifyReminder = async (action: string, id: number) => {
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };
        const body = {
            action: action,
        }

        try {
            const response = await axios.put(
                `/api/medicine-reminder/${id}/`,
                body,
                config,
            );
            toast({
                variant: "success",
                title: `${response.data.message}`,
            });
            setModifyLoading(false);
            fetchReminders();
        } catch (err: unknown) {
            setModifyLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error updating Reminder`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error updating Reminder",
                });
            }
        }
        setModifyLoading(false);
    };

    const handleAddReminder = () => {

    };

    useEffect(() => {
        if (access) fetchReminders();
    }, [access]);

    useEffect(() => {
        if (access) fetchReminders();
    }, []);

    return (
        <div className="container mx-auto rounded-2xl min-h-[89vh]">
            <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                <h2 className="text-2xl font-bold text-center">My Medicine Reminders</h2>
                <Button onClick={() => setDrawerOpen(true)} type="button" variant="outline">
                    <History />
                </Button>
            </div>
            <div className="w-full mb-8 overflow-hidden rounded-lg">
                < RemindersTable reminders={reminders} setSelectedID={setSelectedID} modifyReminder={modifyReminder} isLoading={modifyLoading} selectedID={selectedID} />
            </div>

            {/* history slider */}
            <HistoryDrawer setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />


            {/* add form */}
            <div className="fixed bottom-10 right-10" onClick={() => setModalOpen(true)}>
                <button className="inline-flex items-center justify-center transition-colors duration-150 bg-[#0f172a] rounded-full focus:shadow-outline hover:bg-[#272e3f] p-6" onClick={handleAddReminder}>
                    <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 45.402 45.402">
                        <g>
                            <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                        </g>
                    </svg>
                </button>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen} >
                <DialogContent className="sm:max-w-[1000px] overflow-y-scroll scrollbar-hidden max-h-[90vh]">
                    <DialogHeader className="text-center sm:text-center">
                        <DialogTitle className="font-bold text-3xl">Add a new reminder</DialogTitle>
                    </DialogHeader>
                    {/* form */}
                    <ReminderAddForm fetchReminders={fetchReminders} setModalOpen={setModalOpen} />
                </DialogContent>
            </Dialog>

            {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
        </div>
    );
}

export default MedicineReminders;