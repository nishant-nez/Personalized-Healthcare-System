import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/api/axios";
import { IReminderHistory } from "@/interfaces/IReminderHistory";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import HistoryPieChart from "@/components/HistoryPieChart";
import { IHistoryStats } from "@/interfaces/IHistoryStats";
import HistoryBarChart from "@/components/HistoryBarChart";
import { Card, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


const HistoryDrawer = ({ setDrawerOpen, drawerOpen }: { setDrawerOpen: (open: boolean) => void; drawerOpen: boolean }) => {
    const { access } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [recentHistory, setRecentHistory] = useState<IReminderHistory[]>([]);
    const [stats, setStats] = useState<IHistoryStats | null>(null);
    const { toast } = useToast();


    const fetchRecentReminders = async () => {
        if (!access) return;
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            const response = await axios.get(
                '/api/medicine-reminder/history/recent/',
                config,
            );
            setRecentHistory(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching reminder history`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching reminder history",
                });
            }
        }
        setIsLoading(false);
    };

    const fetchStats = async () => {
        if (!access) return;
        setIsLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            const response = await axios.get(
                '/api/medicine-reminder/history/stats/',
                config,
            );
            setStats(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching reminder stats`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching reminder stats",
                });
            }
        }
        setIsLoading(false);
    };

    const handleSubmit = async (status: boolean, id: number) => {
        setUpdateLoading(true);
        const config = {
            headers: {
                'Authorization': 'JWT ' + access,
            },
        };

        try {
            await axios.put(
                `/api/medicine-reminder/history/update/${id}/`,
                { 'status': status },
                config,
            );
            setUpdateLoading(false);
            toast({
                variant: "success",
                title: "Reminder Status Updated",
            });
            fetchStats();
        } catch (err: unknown) {
            setUpdateLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error modifying reminder history`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error modifying reminder history",
                });
            }
        }
        setUpdateLoading(false);
    };

    useEffect(() => {
        fetchRecentReminders();
        fetchStats();
    }, [access]);

    return (
        <div className="">
            <Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
                <DrawerContent className="scrollbar-hidden">
                    <ScrollArea className="md:overflow-auto md:overflow-y-auto max-h-[80vh]">
                        <div className="mx-auto w-full max-h-[80vh]">
                            <DrawerHeader >
                                <DrawerTitle className="text-center">Reminders Overview</DrawerTitle>
                                <DrawerDescription className="text-center">Check your recent reminders sent to you.</DrawerDescription>
                            </DrawerHeader>

                            {
                                history.length > 0
                                    ?
                                    <div className="h-full pb-2">
                                        <div className="grid grid- grid-cols-1 md:grid-cols-3 gap-4 md:overflow-hidden">
                                            {stats && <HistoryPieChart stats={stats} />}

                                            {stats && <HistoryBarChart stats={stats} />}

                                            <Card className="p-4 mb-4 pb-6 md:max-h-[50vh] scrollbar-hidden">
                                                <CardTitle className="text-center">Recent Reminders</CardTitle>
                                                <div className="flex flex-col gap-4 my-4 max-h-[43vh] overflow-auto scrollbar-hidden">
                                                    {updateLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}

                                                    {
                                                        recentHistory && !isLoading && !updateLoading &&
                                                        recentHistory.map((item) => (
                                                            <div className="w-full cursor-pointer border-border" key={item.id}>
                                                                <Card className="flex p-6 bg-card border-border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-900">
                                                                    <p className="font-normal text-gray-700 dark:text-gray-400">
                                                                        <span className="font-bold pr-2 text-accent-foreground">
                                                                            {
                                                                                new Date(item.timestamp).toLocaleString('en-US', {
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    year: 'numeric',
                                                                                    hour: 'numeric',
                                                                                    minute: 'numeric',
                                                                                    hour12: true,
                                                                                })
                                                                            }
                                                                        </span>
                                                                        Take {item.reminder.medicine_name} ({item.reminder.dosage}) with instructions: {item.reminder.instructions}.
                                                                    </p>
                                                                    <Button variant="outline" size="icon" className="hover:bg-green-300 mx-3 px-2" onClick={() => handleSubmit(true, item.id)}>
                                                                        <Check className="h-4 w-4 hover:text-white" />
                                                                    </Button>
                                                                    <Button variant="outline" size="icon" className="hover:bg-red-300 px-2" onClick={() => handleSubmit(false, item.id)}>
                                                                        <X className="h-4 w-4 hover:text-white" />
                                                                    </Button>
                                                                </Card>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex flex-col items-center justify-center h-full">
                                        No History
                                    </div>
                            }
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default HistoryDrawer;
