import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { isAxiosError } from "axios";
import AuthImage from "@/components/AuthImage";


const Activate = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const { uid, token } = useParams();

    const onSubmit = async () => {
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            await axios.post('/api/auth/users/activation/', { uid, token }, config);
            setIsLoading(false);
            navigate('/login');
            toast({
                variant: "success",
                title: "Account Successfully Activated",
            });
        } catch (error: unknown) {
            setIsLoading(false);
            console.log('error: ', error)
            if (isAxiosError(error)) {
                const data = error.response?.data;
                for (const propName in data) {
                    if (Object.prototype.hasOwnProperty.call(data, propName)) {
                        const propValue = data[propName];
                        toast({
                            variant: "destructive",
                            title: "Account Activation Failed",
                            description: propValue,
                        });
                    }
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Account Activation Failed",
                    description: (error as Error).message,
                });
            }
        }
        setIsLoading(false);
    };


    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2 pt-[80px] bg-background">
                <AuthImage />
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold dark:text-white">Activate Account</h1>
                            <p className="text-balance text-muted-foreground dark:text-gray-400">
                                Click the button below to activate your account
                            </p>
                        </div>
                        <div className="grid gap-4">

                            {isLoading ? (
                                <Button disabled type="submit" className="w-full dark:bg-gray-700 dark:text-gray-300" onClick={onSubmit}>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-gray-300" />
                                    Please Wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full dark:white dark:text-black" onClick={onSubmit}>
                                    Activate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Activate;