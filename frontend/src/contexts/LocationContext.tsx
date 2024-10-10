import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/api/axios';

export const LocationContext = createContext<{
    location: Location | null;
    address: string;
    accuracy: number | null;
    locationError: string | null;
    closestVendorId: number | null;
}>({
    location: null,
    address: '',
    accuracy: null,
    locationError: null,
    closestVendorId: null,
});


type Location = {
    lat: number;
    lng: number;
};

const LocationProvider = ({ children }: { children: ReactNode }) => {
    const [location, setLocation] = useState<Location | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    // const [distanceData, setDistanceData] = useState<{ id: number; distance: number }[]>([]);
    const [address, setAddress] = useState('');
    const [closestVendorId, setClosestVendorId] = useState<number | null>(null);

    const useLocation = (enabled: boolean, accuracyThreshold: number | null, accuracyThresholdWaitTime: number, options?: PositionOptions) => {

        useEffect(() => {
            if (!enabled) {
                setAccuracy(null);
                setLocationError(null);
                setLocation(null);
                return;
            }

            if (navigator.geolocation) {
                let timeout: string | number | NodeJS.Timeout | undefined;
                const geoId = navigator.geolocation.watchPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setAccuracy(position.coords.accuracy);

                        if (accuracyThreshold == null || position.coords.accuracy < accuracyThreshold) {
                            if ((location === null) || (location.lat !== lat && location.lng !== lng)) setLocation({ lat, lng });
                        }
                    },
                    (e) => {
                        setLocationError(e.message);
                    },
                    options ?? { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
                );
                if (accuracyThreshold && accuracyThresholdWaitTime) {
                    timeout = setTimeout(() => {
                        if (!accuracy || accuracy < accuracyThreshold) {
                            setLocationError('Failed to reach desired accuracy');
                        }
                    }, accuracyThresholdWaitTime * 1000);
                }
                return () => {
                    window.navigator.geolocation.clearWatch(geoId);
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                };
            }

            setLocationError('Geolocation API not available');
        }, [enabled, accuracy, accuracyThreshold, accuracyThresholdWaitTime, options]);

        if (!enabled) {
            return [undefined, undefined, undefined];
        }
        return [location, accuracy, locationError];
    };

    const fetchLocationData = async (originLocation: Location, destLocation: Location) => {
        try {
            const proxyurl = "https://corsproxy.io/?";
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destLocation.lat},${destLocation.lng}&origins=${originLocation.lat},${originLocation.lng}&units=metric&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
            const response = await axios.get(proxyurl + encodeURIComponent(url));
            return response.data;
        }
        catch (err) {
            console.log('maps error: ', err);
        }
    };

    // const filterVendors = async (location: Location) => {
    //     try {
    //         const result = [];
    //         const response = await axios.get('/api/vendor/all', { withCredentials: true });
    //         if (response.data.length > 1) {

    //             for (const vendor of response.data) {
    //                 try {
    //                     const distance = await fetchLocationData(location, { lat: vendor.latitude, lng: vendor.longitude });
    //                     if (distance.rows[0].elements[0].status !== "ZERO_RESULTS") {
    //                         result.push({ id: vendor.id, distance: distance.rows[0].elements[0].distance.value });
    //                         const originAddress = distance.origin_addresses[0];
    //                         if (address !== originAddress) setAddress(originAddress);
    //                     } else {
    //                         console.log('ZERO_RESULTS for set location');
    //                     }
    //                 } catch (error) {
    //                     console.error('Error fetching distance:', error);
    //                 }
    //             }

    //             setDistanceData(result);
    //         }
    //     } catch (err) {
    //         console.log('vendor fetch error', err)
    //     }
    // };

    useLocation(true, null, 10000);

    useEffect(() => {
        if (location) {
            // development
            // process.env.REACT_APP_NODE_ENV === 'development' ? filterVendors({ lat: -25.589270, lng: 151.299039 }) : filterVendors(location);
            // filterVendors({ lat: -25.589270, lng: 151.299039 });
            // filterVendors(location);
            console.log('location: ', location);
        }
    }, [location]);

    // useEffect(() => {
    //     if (distanceData.length > 0) {
    //         const shortestDistObj = distanceData.reduce((min, obj) => {
    //             return (obj.distance as number) < (min.distance as number) ? obj : min;
    //         });
    //         if (closestVendorId !== shortestDistObj.id) setClosestVendorId(shortestDistObj.id);
    //     }
    // }, [distanceData]);




    return <LocationContext.Provider value={{ location, address, accuracy, locationError, closestVendorId }}>{children}</LocationContext.Provider>;
}

export default LocationProvider;