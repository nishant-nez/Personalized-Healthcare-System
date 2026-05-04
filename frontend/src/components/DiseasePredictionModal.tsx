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
    const [nearestHospitals, setNearestHospitals] = useState<INearestHospital[]>([]);
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

    const fetchNearestHospitals = async () => {
        if (!location) return;
        setIsLoading(true);
        try {
            const response = await axios.get('/api/hospitals/nearby/distance/', {
                params: { lat: location.lat, lng: location.lng, limit: 5 },
            });
            setNearestHospitals(response.data);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast({ variant: "destructive", title: "Error fetching hospitals", description: err.message });
            } else {
                toast({ variant: "destructive", title: "Error fetching hospitals" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (location) fetchNearestHospitals();
    }, [location]);

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
                                    <div key={symptom} className="mb-1">
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
                                        {nearestHospitals.length > 0 && (
                                            <span>From: <span className="font-bold">{nearestHospitals[0].origin_address}</span></span>
                                        )}
                                    </SheetDescription>
                                    {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
                                    {!isLoading && nearestHospitals.length === 0 && (
                                        <p className="text-center text-muted-foreground">No hospitals found nearby.</p>
                                    )}
                                </SheetHeader>
                                <div className="overflow-y-auto max-h-[calc(100vh-200px)] space-y-4 mt-4 pr-1">
                                    {nearestHospitals.map((hospital) => (
                                        <div key={hospital.place_id} className="rounded-xl shadow-lg border border-border bg-background p-3">
                                            {hospital.photo_url && (
                                                <div className="w-full h-[160px] overflow-hidden mb-3">
                                                    <img src={hospital.photo_url} alt={hospital.name} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-muted-foreground text-xs font-medium">
                                                    {hospital.name.toLowerCase().includes('clinic') ? 'Clinic' : 'Hospital'}
                                                </p>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-muted-foreground text-xs font-bold ml-1">
                                                        {hospital.rating} <span className="font-normal">({hospital.user_ratings_total})</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-foreground text-base">{hospital.name}</h3>
                                            <p className="text-muted-foreground text-sm">{hospital.formatted_address}</p>
                                            <div className="flex gap-4 mt-2 text-sm">
                                                <span className="font-semibold">{hospital.distance?.text}</span>
                                                <span className="text-muted-foreground">{hospital.duration?.text} by vehicle</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
