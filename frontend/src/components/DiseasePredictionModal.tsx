import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { IDiseasePrediction } from "@/interfaces/IDiseasePrediction";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useContext, useEffect, useState } from "react";
import { LocationContext } from "@/contexts/LocationContext";
import { INearestHospital } from "@/interfaces/IHospital";
import axios from "@/api/axios";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";



const DiseasePredictionModal = ({ modalOpen, setModalOpen, data }: { modalOpen: boolean, setModalOpen: (open: boolean) => void, data: IDiseasePrediction | null }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nearestHospital, setNearestHospital] = useState<INearestHospital | null>(null);
    const { location } = useContext(LocationContext);
    const { toast } = useToast();

    const getSeverityColor = (severity: number) => {
        const colors = [
            "bg-green-200 text-green-800",
            "bg-lime-200 text-lime-800",
            "bg-yellow-200 text-yellow-800",
            "bg-orange-200 text-orange-800",
            "bg-red-200 text-red-800",
        ]
        return colors[severity - 1] || colors[0]
    }

    const fetchNearestHospital = async () => {
        setIsLoading(true);
        const params: { limit: number; lat?: number, lng?: number } = {
            limit: 1,
            lat: location?.lat,
            lng: location?.lng,
        }

        try {
            const response = await axios.get(
                '/api/hospitals/nearest/',
                { params: params }
            );
            setNearestHospital(response.data[0]);
            setIsLoading(false);
        } catch (err: unknown) {
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
        if (location) fetchNearestHospital();
    }, []);

    if (data !== null) return (
        <>
            <Dialog open={modalOpen} onOpenChange={setModalOpen} >
                <DialogContent className="sm:max-w-[1000px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader className="text-center sm:text-center">
                        <DialogTitle className="font-bold text-3xl">Disease Prediction</DialogTitle>
                        <DialogDescription>
                            Follow these to live a healthy lifestyle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 items-center mr-20">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Disease
                            </Label>
                            <Input
                                id="name"
                                readOnly
                                value={data.Disease}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                readOnly
                                value={data.Description}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="diet" className="text-right">
                                Diet
                            </Label>
                            <Textarea
                                id="diet"
                                readOnly
                                value={data.Diet.join(', ')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medication" className="text-right">
                                Medications
                            </Label>
                            <Textarea
                                id="medication"
                                readOnly
                                value={data.Medications.join(', ')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="precautions" className="text-right">
                                Precautions
                            </Label>
                            <Textarea
                                id="precautions"
                                readOnly
                                value={data.Precautions.join(', ')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="workouts" className="text-right">
                                Recommendations
                            </Label>
                            <Textarea
                                id="workouts"
                                readOnly
                                value={data.Workouts.join(', ')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="severity" className="text-right">
                                Symptoms Severity
                            </Label>
                            <div
                                id="severity"
                                className="col-span-3 flex gap-3 text-sm"
                            >
                                {Object.entries(data.Severity).map(([symptom, severity]) => (
                                    <div key={severity} className="mb-1">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                                                Number(severity)
                                            )}`}
                                        >
                                            {symptom} (Severity: {severity})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        {/* Hospital Sheet */}
                        <Sheet>
                            <SheetTrigger>
                                <Button className="mr-16 mb-2" type="submit">Get Nearest Hospital</Button>
                            </SheetTrigger>
                            <SheetContent style={{ maxWidth: '30vw' }}>
                                <SheetHeader>
                                    <SheetTitle className="text-2xl text-center mb-4">Get to the nearest hospital</SheetTitle>
                                    <SheetDescription>
                                        {/* hospital */}
                                    </SheetDescription>
                                    {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
                                    {nearestHospital && <>
                                        <div className="flex justify-between mx-4">From: <span className="font-bold">{nearestHospital.origin_address}</span></div>
                                        <div className="flex justify-between mx-4">To: <span className="font-bold">{nearestHospital.name}</span></div>
                                        <div className="flex justify-between mx-4">Distance: <span className="font-bold">{nearestHospital.distance.text}</span></div>
                                        <div className="flex justify-between mx-4">Duration (vehicle): <span className="font-bold">{nearestHospital.duration.text}</span></div>
                                        <div className="flex flex-col justify-center mb-3">
                                            <div
                                                className="relative flex flex-col space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
                                                <div className="w-[510px] h-[290px] overflow-hidden">
                                                    <img src={nearestHospital.photo_url} alt={nearestHospital.name} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                                <div className="w-full bg-white flex flex-col space-y-2 p-3 justify-between">
                                                    <div className="flex justify-between item-center top-0">
                                                        <p className="text-gray-500 font-medium hidden md:block">Hospital</p>
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20"
                                                                fill="currentColor">
                                                                <path
                                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <p className="text-gray-600 font-bold text-sm ml-1">
                                                                {nearestHospital.rating}
                                                                <span className="text-gray-500 font-normal"> ({nearestHospital.user_ratings_total} reviews)</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-gray-800 md:text-2xl text-lg">{nearestHospital.name}</h3>
                                                        <p className="md:text-lg text-gray-500 text-base text-justify">{nearestHospital.formatted_address}</p>
                                                    </div>
                                                    <div className="font-light">Coords: {nearestHospital.geometry.location.lat}, {nearestHospital.geometry.location.lng}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                                </SheetHeader>
                                <Button className="absolute right-4 bottom-4">
                                    <Link to={'/hospitals'}>Get More</Link>
                                </Button>
                            </SheetContent>
                        </Sheet>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </>
    );
}

export default DiseasePredictionModal;