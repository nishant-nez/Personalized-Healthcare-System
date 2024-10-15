import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { useAuth } from "@/contexts/AuthContext";
import Select from "react-select";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { IReminder } from "@/interfaces/IReminder";
import {
    Select as SelectForm,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const formSchema = z.object({
    medicine_name: z.string().min(1),
    dosage: z.string().min(1),
    instructions: z.string(),
    reminder_time: z.string(),
    // reminder_type: z.string().optional(),
    start_date: z.date(),  // Allow both string and date
    end_date: z.date(),    // Allow both string and date
    image: z.instanceof(File).optional(),
    day_of_week: z.array(z.number()).optional(),
    interval_value: z.coerce.number().optional(),
    interval_type: z.enum(['minutes', 'hours', 'weeks']).optional(),
});

const ReminderAddForm = ({ fetchReminders, setModalOpen }: { fetchReminders: () => void, setModalOpen: (data: boolean) => void }) => {
    const { access } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<IReminder['reminder_type']>("daily"); // State to track the selected tab
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log('selected tab: ', selectedTab)
        // console.log("Submitted values:", values);
        // console.log("Form Errors:", form.formState.errors); // Check errors after submission

        const formatted_start_date = new Date(values.start_date).toISOString().split('T')[0]
        // console.log('formatted start_date: ', formatted_start_date.toISOString().split('T')[0])
        const formatted_end_date = new Date(values.end_date).toISOString().split('T')[0]
        // console.log('formatted end_date: ', formatted_end_date.toISOString().split('T')[0])
        // values['start_date'] = formatted_start_date
        // values['end_date'] = formatted_end_date
        // console.log("Submitted values:", values);
        console.log(values)

        // let body: IReminder = {
        //     'medicine_name': values.medicine_name,
        //     'dosage': values.dosage,
        //     'instructions': values.instructions,
        //     'start_date': formatted_start_date,
        //     'end_date': formatted_end_date,
        //     'reminder_type': selectedTab,
        //     'reminder_time': values.reminder_time,
        //     'is_active': true,
        // };
        const formData = new FormData();
        formData.append('medicine_name', values.medicine_name);
        formData.append('dosage', values.dosage);
        formData.append('instructions', values.instructions);
        formData.append('start_date', formatted_start_date);
        formData.append('end_date', formatted_end_date);
        formData.append('reminder_type', selectedTab);
        formData.append('reminder_time', values.reminder_time);
        formData.append('is_active', 'true');

        if (values.image) {
            formData.append('image', values.image);
        }
        if (selectedTab === 'weekly' && values.day_of_week) {
            // body = {
            //     ...body,
            //     'day_of_week': values.day_of_week.toString()
            // }
            formData.append('day_of_week', values.day_of_week.toString());
        }
        if (selectedTab === "interval" && values.interval_type && values.interval_value) {
            // body = {
            //     ...body,
            //     'interval_value': values.interval_value?.toString(),
            //     'interval_type': values.interval_type,
            // }
            formData.append('interval_value', values.interval_value?.toString());
            formData.append('interval_type', values.interval_type);
        };
        // console.log('body: ', body);

        setIsLoading(true);

        try {
            const config = {
                headers: {
                    'Authorization': 'JWT ' + access,
                },
            };
            await axios.post('/api/medicine-reminder/', formData, config);

            toast({
                variant: "success",
                title: "Reminder Created",
            });
            fetchReminders();
            setModalOpen(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            if (isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "Error creating Reminder",
                    description: error.response?.data.detail,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error creating Reminder",
                    description: (error as Error).message,
                });
            }
        } finally {
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full p-8 pb-6">
            <h2 className="text-sm mb-4">Select the type of reminder.</h2>
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs
                        defaultValue="daily"
                        className="w-full"
                        onValueChange={setSelectedTab}
                    >
                        <TabsList className="w-full flex justify-evenly">
                            <TabsTrigger value="daily" className="w-full">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="w-full">Weekly</TabsTrigger>
                            <TabsTrigger value="interval" className="w-full">Interval Based</TabsTrigger>
                        </TabsList>

                        {/* Daily Reminder Form */}
                        <TabsContent value="daily" className="mx-3">
                            <ReminderFields form={form} reminderType="daily" />
                        </TabsContent>

                        {/* Weekly Reminder Form */}
                        <TabsContent value="weekly" className="mx-3">
                            <ReminderFields form={form} reminderType="weekly" />
                        </TabsContent>

                        {/* Interval Reminder Form */}
                        <TabsContent value="interval" className="mx-3">
                            <ReminderFields form={form} reminderType="interval" />
                        </TabsContent>

                        <div className="flex justify-center mt-4">
                            <Button type="submit" disabled={isLoading} className="mt-6">
                                {isLoading ? "Submitting..." : "Submit Reminder"}
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
};

export default ReminderAddForm;

interface ReminderFieldsProps {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    reminderType: string;
}

const ReminderFields: React.FC<ReminderFieldsProps> = ({ form, reminderType }) => {
    const weekdaysOptions = [
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 7, label: "Sunday" },
    ];

    return (
        <>
            <FormField
                control={form.control}
                name="medicine_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Medicine Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter medicine name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter dosage" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                placeholder="Image"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter instructions" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="reminder_time"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reminder Time</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {reminderType === "weekly" && (
                <FormField
                    control={form.control}
                    name="day_of_week"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Days of the Week</FormLabel>
                            <FormControl>
                                <Select
                                    isMulti
                                    options={weekdaysOptions}
                                    onChange={(selectedOptions) => {
                                        const values = selectedOptions.map(option => option.value);
                                        field.onChange(values);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {reminderType === "interval" && (
                <div className="flex justify-evenly items-center w-full gap-4">
                    <FormField
                        control={form.control}
                        name="interval_value"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Interval Value</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter interval value" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <p className="pt-4 font-light text-sm">every</p> */}
                    <FormField
                        control={form.control}
                        name="interval_type"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Interval Type</FormLabel>
                                <FormControl>
                                    {/* <Input placeholder="days, weeks, etc." {...field} /> */}
                                    <SelectForm
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Interval type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minutes">Minutes</SelectItem>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                            <SelectItem value="weeks">Weeks</SelectItem>
                                        </SelectContent>
                                    </SelectForm>

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            <div className="flex justify-evenly w-full gap-4">
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <DatePickerField field={field} label="Start Date" />
                    )}
                />
                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <DatePickerField field={field} label="End Date" />
                    )}
                />
            </div>
        </>
    );
};

import { ControllerRenderProps } from "react-hook-form";

export function DatePickerField({ field, label }: { field: ControllerRenderProps<z.infer<typeof formSchema>, keyof z.infer<typeof formSchema>>; label: string }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    return (
        <FormItem className="w-1/2">
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                field.onChange(date); // Update form field with the selected date
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}