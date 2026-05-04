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
import { Loader2 } from "lucide-react";


const GoogleMapsBox = ({ markers }: { markers: IHospital[] | INearestHospital[] }) => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const { location } = useContext(LocationContext);
    const { toast } = useToast();

    useEffect(() => {
        if (location) {
            setPosition(location);
        }
    }, [location]);

    useEffect(() => {
        if (!position && markers.length > 0) {
            setPosition({
                lat: parseFloat(markers[0].geometry.location.lat),
                lng: parseFloat(markers[0].geometry.location.lng),
            });
        }
    }, [markers]);

    if (!position) {
        return (
            <div className="h-[40vh] container mx-auto mb-12 flex items-center justify-center bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY} >
            <div className="h-[40vh] container mx-auto mb-12">
                <Map
                    defaultZoom={13}
                    center={position}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                >
                    {markers && markers.map((marker) => (
                        <div key={marker.place_id}>
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
                    ))}
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

export default GoogleMapsBox;
