import { IHospital } from "@/interfaces/IHospital";

const HospitalSearchCard = ({ hospital }: { hospital: IHospital }) => {
    return (
        <div className="flex flex-col justify-center mb-3">
            <div
                className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-border bg-card">
                <div className="w-[450px] h-[290px] overflow-hidden">
                    <img src={hospital.photo_url} alt={hospital.name} className="w-full h-full object-cover rounded-md" />
                </div>


                <div className="w-full md:w-2/3 flex flex-col space-y-2 p-3 justify-between">
                    <div className="flex justify-between item-center top-0">
                        <p className="text-muted-foreground font-medium hidden md:block">
                            {hospital.name.toLowerCase().includes('clinic') ? 'Clinic' : 'Hospital'}
                        </p>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <p className="text-muted-foreground font-bold text-sm ml-1">
                                {hospital.rating}
                                <span className="text-muted-foreground font-normal"> ({hospital.user_ratings_total} reviews)</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-accent-foreground md:text-2xl text-lg">{hospital.name}</h3>
                        <p className="md:text-lg text-muted-foreground text-base">{hospital.formatted_address}</p>
                    </div>
                    <div className="font-light text-muted-foreground">Coords: {hospital.geometry.location.lat}, {hospital.geometry.location.lng}</div>
                </div>
            </div>
        </div>
    );
}

export default HospitalSearchCard;