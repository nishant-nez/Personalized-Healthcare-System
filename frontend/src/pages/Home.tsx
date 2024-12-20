import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
// import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { StylesConfig } from 'react-select';
import { AxiosError } from "axios";
import DiseasePredictionModal from "@/components/DiseasePredictionModal";
import { IDiseasePrediction } from "@/interfaces/IDiseasePrediction";
import HomeFeatures from "@/components/HomeFeatures";
import { useTheme } from "@/contexts/theme-provider";


const Home = () => {
    const { user, access } = useAuth();
    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }[] | null>(null);
    const [symptoms, setSymptoms] = useState<{ value: string; label: string }[] | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<IDiseasePrediction | null>(null);
    const theme = useTheme().theme;
    const { toast } = useToast();


    const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
        control: (base) => ({
            ...base,
            cursor: 'pointer',
            width: '45vw',
            fontSize: '16px',
            // fontWeight: 'bold',
            borderRadius: '8px',
            padding: '6px 5px',
            border: '1px solid #21274F !important',
            boxShadow: 'none',
            '&:focus': {
                border: '0 !important',
            },

        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: theme === 'light' ? 'gray' : 'white',
            color: theme === 'light' ? 'white' : 'black',
            cursor: 'pointer',
        }),
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(access ? { 'Authorization': `JWT ${access}` } : {}),
        }
    };


    const handlePredict = async () => {
        if (selectedOption && selectedOption.length > 0) {
            const symptomsList = selectedOption.map(item => item.value);
            try {
                const response = await axios.post(
                    '/api/diseases/predict/',
                    { symptoms: symptomsList },
                    config,
                );
                setModalOpen(true);
                setPrediction(response.data);
            } catch (err: AxiosError | unknown) {
                console.log('Error', err);
                toast({
                    variant: "destructive",
                    title: `Error predicting disease`,
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: `Please enter atleast one symptom`,
            });
        }
    };

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get('/api/diseases/symptoms/');
            const formattedSymptoms = response.data.map((symptom: string) => {
                return { value: symptom, label: symptom[0].toUpperCase() + symptom.slice(1).replace(/_/g, ' ') }
            });
            setSymptoms(formattedSymptoms);
        } catch (err: unknown) {
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching symptoms`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching symptoms",
                });
            }
        }
    };

    useEffect(() => {
        fetchSymptoms();
    }, []);


    return (
        <div className="min-h-screen flex justify-between items-center flex-col gap-16 bg-background">
            <div className="flex flex-col content-center items-center justify-center mt-44">
                <div className="p-4 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Personalized Healthcare System</h1>
                    <p className="text-lg font-light pt-3 pb-4 hidden lg:block">
                        Get prediction for diseases along with description, precautions, preventive measures and possible medications.
                        {user && 'Your diagnostic history will automatically be saved to the database.'}
                    </p>
                </div>
                <div className="w-[40%] mx-auto flex gap-4 items-center content-center justify-center">
                    <CreatableSelect
                        theme={(selectTheme) => ({
                            ...selectTheme,
                            colors: {
                                ...selectTheme.colors,
                                danger: 'red',
                                dangerLight: 'red',
                                primary: `${theme === 'light' ? 'white' : 'black'}`,
                                primary25: `${theme === 'light' ? 'lightgray' : 'darkgray'}`,
                                primary50: `${theme === 'light' ? 'lightgray' : 'darkgray'}`,
                                primary75: `${theme === 'light' ? 'lightgray' : 'darkgray'}`,
                                neutral: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral0: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral5: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral10: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral15: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral20: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral30: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral40: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral50: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral60: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral70: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral80: `${theme === 'light' ? 'white' : 'black'}`,
                                neutral90: `${theme === 'light' ? 'white' : 'black'}`,
                            },
                        })}
                        styles={{
                            ...selectStyles,
                            input: (base) => ({
                                ...base,
                                color: `${theme === 'light' ? 'black' : 'white'}`,
                                // backgroundColor: 'dark',
                                // colorScheme: 'dark',
                            }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: 'gray',
                                '&:hover': {
                                    color: 'darkgray',
                                },
                            }),
                            clearIndicator: (base) => ({
                                ...base,
                                color: 'gray',
                                '&:hover': {
                                    color: 'darkred',
                                },
                            }),
                        }}
                        defaultValue={selectedOption}
                        onChange={(newValue) => setSelectedOption(newValue as { value: string; label: string }[])}
                        options={symptoms || []}
                        placeholder={'Enter your symptoms'}
                        isMulti
                        isSearchable
                        isClearable
                    />
                    <Button type="submit" className="py-6 px-6" onClick={handlePredict}>
                        Predict
                    </Button>
                </div>
            </div>

            <HomeFeatures />

            <DiseasePredictionModal modalOpen={modalOpen} setModalOpen={setModalOpen} data={prediction} />
        </div>
    );
}

export default Home;