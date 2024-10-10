import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/api/axios";
import { useContext, useEffect, useState } from "react";
import HospitalSearchCard from "@/components/HospitalSeachCard";
import NearestHospitalCard from "@/components/NearestHospitalCard";
import { IHospital, INearestHospital } from "@/interfaces/IHospital";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import EmptySearchResults from "@/components/EmptySearchResults";
import { LocationContext } from "@/contexts/LocationContext";


const Hospitals = () => {
    const [hospitals, setHospitals] = useState<IHospital[]>([]);
    const [nearestHospital, setNearestHospital] = useState<INearestHospital[] | null>(null);
    const [search, setSearch] = useState<string>("");
    const [nearMe, setNearMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { location } = useContext(LocationContext);
    const { toast } = useToast();

    const handleSearch = () => {
        if (nearMe) fetchNearestHospital();
        else fetchHospitals();
    };

    const fetchHospitals = async () => {
        setIsLoading(true);
        let params: { limit: number; search?: string } = {
            limit: 15
        }
        if (search !== '') {
            params = { ...params, search: search }
        }

        try {
            const response = await axios.get(
                '/api/hospitals/',
                { params: params }
            );
            setHospitals(response.data);
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

    const fetchNearestHospital = async () => {
        setIsLoading(true);
        let params: { limit: number; search?: string, lat?: number, lng?: number } = {
            limit: 10,
            lat: location?.lat,
            lng: location?.lng,
        }
        if (search !== '') {
            params = { ...params, search: search }
        }

        try {
            const response = await axios.get(
                '/api/hospitals/nearest/',
                { params: params }
            );
            setNearestHospital(response.data);
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
        fetchHospitals();
    }, []);

    useEffect(() => {
        console.log(search)
        if (search === '') {
            fetchHospitals();
        }
    }, [search]);

    useEffect(() => {
        if (nearMe) fetchNearestHospital();
    }, [nearMe]);

    return (
        <>
            <div className="h-[35vh] flex flex-col content-center items-center justify-center">
                <div className="p-4 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Search for Hospitals</h1>
                    <p className="text-lg font-light pt-3 pb-4 text-center">
                        Search for hospitals and clinics within Kathmandu valley.
                    </p>
                </div>
                <div className="w-[40%] mx-auto flex gap-4 items-center content-center justify-center">
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Switch
                        checked={nearMe}
                        onCheckedChange={setNearMe}
                    />
                    <div className="flex">
                        <p className="">Near</p>
                        <p className="">&nbsp;me</p>
                    </div>

                    {isLoading
                        ? <Button type="submit" className="py-4 px-8" onClick={handleSearch} disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                        : <Button type="submit" className="py-4 px-6" onClick={handleSearch}>
                            Search
                        </Button>
                    }
                </div>
                {
                    nearestHospital && nearMe &&
                    <div className="mt-6">
                        Using Your Location:
                        <span className="font-bold">
                            &nbsp;{nearestHospital[0].origin_address}
                            <span className="font-normal">
                                &nbsp;({location?.lat}, {location?.lng})
                            </span>
                        </span>
                    </div>
                }
            </div>

            {hospitals && !nearMe && hospitals.map((hospital) => <div key={hospital.place_id}><HospitalSearchCard hospital={hospital} /></div>)}
            {nearestHospital && nearMe && nearestHospital.map((hospital) => <div key={hospital.place_id} className="w-full"><NearestHospitalCard hospital={hospital} /></div>)}

            {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
            {hospitals.length === 0 && !nearMe && !isLoading && <EmptySearchResults />}
            {!nearestHospital && nearMe && !isLoading && <EmptySearchResults />}
        </>
    );
}

export default Hospitals;