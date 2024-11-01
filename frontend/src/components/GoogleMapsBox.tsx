import { useContext, useEffect, useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
} from "@vis.gl/react-google-maps";
import { IHospital, INearestHospital } from "@/interfaces/IHospital";
import { LocationContext } from "@/contexts/LocationContext";
import { useToast } from "./ui/use-toast";


const GoogleMapsBox = ({ markers }: { markers: IHospital[] | INearestHospital[] }) => {
    const [position, setPosition] = useState({ lat: 27.708176, lng: 85.321656 });
    const range = 5; // kilometeres
    const { location } = useContext(LocationContext);
    const { toast } = useToast();

    useEffect(() => {
        let positionUpdated = false;

        for (const marker of markers) {
            const markerLat = parseFloat(marker.geometry.location.lat);
            const markerLng = parseFloat(marker.geometry.location.lng);

            const distance = haversineDistance(position.lat, position.lng, markerLat, markerLng);

            if (distance <= range) {
                positionUpdated = true;
                break;
            }
        }

        if (!positionUpdated && markers.length > 0) {
            setPosition({ lat: parseFloat(markers[0].geometry.location.lat), lng: parseFloat(markers[0].geometry.location.lng) })
        }
    }, [markers]);

    useEffect(() => {
        if (location) {
            setPosition(location);
        }
    }, [location]);

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY} >
            <div className="h-[40vh] container mx-auto mb-12">
                <Map
                    defaultZoom={13}
                    // zoom={13}
                    defaultCenter={position}
                    // center={position}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                >
                    {markers && markers.map((marker) => {
                        return (
                            <div id={marker.place_id}>
                                <AdvancedMarker
                                    clickable
                                    onClick={() => {
                                        toast({
                                            description: marker.name,
                                        })
                                    }}
                                    position={{ lat: parseFloat(marker.geometry.location.lat), lng: parseFloat(marker.geometry.location.lng) }}
                                >
                                    <Pin />
                                </AdvancedMarker>
                            </div>
                        )
                    })}
                    {location &&
                        <AdvancedMarker
                            position={{ lat: location.lat, lng: location.lng }}
                        >
                            <Pin
                                background={'yellow'}
                                borderColor={'green'}
                                glyphColor={'green'}
                            />
                        </AdvancedMarker>
                    }
                </Map>
            </div>
        </APIProvider>
    );
}


function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => value * Math.PI / 180;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}


export default GoogleMapsBox;