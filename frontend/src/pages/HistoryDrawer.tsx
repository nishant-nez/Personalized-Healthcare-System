import { Minus, Plus, Check, X, Loader2 } from "lucide-react";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/api/axios";
import { IReminderHistory } from "@/interfaces/IReminderHistory";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";



const HistoryDrawer = ({ setDrawerOpen, drawerOpen }: { setDrawerOpen: (open: boolean) => void; drawerOpen: boolean }) => {
    const { access } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [recentHistory, setRecentHistory] = useState<IReminderHistory[]>([]);
    const { toast } = useToast();


    const fetchRecentReminders = async () => {
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

    const handleSubmit = async (status: boolean, id: number) => {
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
            toast({
                variant: "success",
                title: "Reminder Status Updated",
            });
        } catch (err: unknown) {
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
    };

    useEffect(() => {
        fetchRecentReminders();
    }, [access]);

    return (
        <div className="">
            <Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full h-[60vh]">
                        <DrawerHeader >
                            <DrawerTitle className="text-center">Reminders Overview</DrawerTitle>
                            <DrawerDescription className="text-center">className="text-center"Check your recent reminders sent to you.</DrawerDescription>
                        </DrawerHeader>

                        <div className="grid grid-cols-3 gap-4 border h-full m-4">
                            <div>chart1</div>
                            <div>chart2</div>
                            <div >
                                <h5 className="mb-2 text-xl mt-4 font-bold tracking-tight text-gray-900">Recent Reminders</h5>
                                <div className="flex flex-col gap-4 my-4">

                                    {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}

                                    {
                                        recentHistory && !isLoading &&
                                        recentHistory.map((item) => (
                                            <div className="w-full cursor-pointer">
                                                <div className="flex p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                                                    <p className="font-normal text-gray-700 dark:text-gray-400">
                                                        <span className="font-bold pr-2">
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
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                        {/* <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter> */}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default HistoryDrawer;
