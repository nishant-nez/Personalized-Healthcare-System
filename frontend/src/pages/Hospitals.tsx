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
import GoogleMapsBox from "@/components/GoogleMapsBox";

const CACHE_KEY = "hospitals_cache";
const CACHE_DISTANCE_KEY = "hospitals_distance_cache";
const CACHE_COORDS_KEY = "hospitals_cached_coords";
const MAX_CACHE_DISTANCE_KM = 2;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getCachedCoords(): { lat: number; lng: number } | null {
    const raw = localStorage.getItem(CACHE_COORDS_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function isCacheValid(lat: number, lng: number): boolean {
    const cached = getCachedCoords();
    if (!cached) return false;
    return haversineDistance(cached.lat, cached.lng, lat, lng) < MAX_CACHE_DISTANCE_KM;
}

function getCachedHospitals(key: string) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function setCacheData(key: string, data: unknown, lat: number, lng: number) {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(CACHE_COORDS_KEY, JSON.stringify({ lat, lng }));
}

const Hospitals = () => {
    const [hospitals, setHospitals] = useState<IHospital[]>([]);
    const [nearestHospital, setNearestHospital] = useState<INearestHospital[] | null>(null);
    const [search, setSearch] = useState<string>("");
    const [nearMe, setNearMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { location } = useContext(LocationContext);
    const { toast } = useToast();

    const handleSearch = () => {
        if (nearMe) fetchNearestHospital(true);
        else fetchHospitals(true);
    };

    const fetchHospitals = async (forceRefresh = false) => {
        if (!location) {
            toast({ variant: "destructive", title: "Location not available", description: "Please allow location access." });
            return;
        }

        if (!forceRefresh && !search && isCacheValid(location.lat, location.lng)) {
            const cached = getCachedHospitals(CACHE_KEY);
            if (cached) {
                setHospitals(cached);
                return;
            }
        }

        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                lat: location.lat,
                lng: location.lng,
                limit: 20,
            };
            if (search) params.search = search;

            const response = await axios.get("/api/hospitals/nearby/", { params });
            setHospitals(response.data);
            if (!search) {
                setCacheData(CACHE_KEY, response.data, location.lat, location.lng);
            }
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

    const fetchNearestHospital = async (forceRefresh = false) => {
        if (!location) {
            toast({ variant: "destructive", title: "Location not available", description: "Please allow location access." });
            return;
        }

        if (!forceRefresh && !search && isCacheValid(location.lat, location.lng)) {
            const cached = getCachedHospitals(CACHE_DISTANCE_KEY);
            if (cached) {
                setNearestHospital(cached);
                return;
            }
        }

        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                lat: location.lat,
                lng: location.lng,
                limit: 10,
            };
            if (search) params.search = search;

            const response = await axios.get("/api/hospitals/nearby/distance/", { params });
            setNearestHospital(response.data);
            if (!search) {
                setCacheData(CACHE_DISTANCE_KEY, response.data, location.lat, location.lng);
            }
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
        if (location) fetchHospitals();
    }, [location]);

    useEffect(() => {
        if (search === "" && location) fetchHospitals();
    }, [search]);

    useEffect(() => {
        if (nearMe && location) fetchNearestHospital();
    }, [nearMe]);

    return (
        <div className="min-h-screen bg-background">
            <div className="mt-20 mb-9 flex flex-col content-center items-center justify-center pt-20">
                <div className="p-4 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Search for Hospitals</h1>
                    <p className="text-lg font-light pt-3 pb-4 text-center">
                        Search for hospitals and clinics near your location.
                    </p>
                </div>
                <div className="w-[40%] mx-auto flex flex-col md:flex-row gap-4 items-center content-center justify-center mb-4">
                    <Input
                        type="search"
                        value={search}
                        placeholder="Search for hospitals"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Switch checked={nearMe} onCheckedChange={setNearMe} />
                    <div className="flex">
                        <p>Near</p>
                        <p>&nbsp;me</p>
                    </div>

                    {isLoading ? (
                        <Button type="submit" className="py-4 px-8 dark" onClick={handleSearch} disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Button type="submit" className="py-4 px-6" onClick={handleSearch}>
                            Search
                        </Button>
                    )}
                </div>
                {nearestHospital && nearMe && (
                    <div className="mt-6 text-center mx-4">
                        Using Your Location:
                        <span className="font-bold">
                            &nbsp;{nearestHospital[0]?.origin_address}
                            <span className="font-normal">
                                &nbsp;({location?.lat}, {location?.lng})
                            </span>
                        </span>
                    </div>
                )}
                {!location && (
                    <p className="text-muted-foreground mt-4">Waiting for location access...</p>
                )}
            </div>

            {!nearMe && <GoogleMapsBox markers={hospitals} />}
            {nearMe && <GoogleMapsBox markers={nearestHospital ? nearestHospital : []} />}

            {hospitals &&
                !nearMe &&
                hospitals.map((hospital) => (
                    <div key={hospital.place_id} className="mt-4">
                        <HospitalSearchCard hospital={hospital} />
                    </div>
                ))}

            {nearestHospital &&
                nearMe &&
                nearestHospital.map((hospital) => (
                    <div key={hospital.place_id} className="w-full">
                        <NearestHospitalCard hospital={hospital} />
                    </div>
                ))}

            {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
            {hospitals.length === 0 && !nearMe && !isLoading && location && <EmptySearchResults />}
            {!nearestHospital && nearMe && !isLoading && location && <EmptySearchResults />}
        </div>
    );
};

export default Hospitals;
