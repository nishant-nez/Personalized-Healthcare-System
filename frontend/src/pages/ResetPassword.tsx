import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { isAxiosError } from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";


export const description =
    "A Password reset page with email input."

export const iframeHeight = "800px"

export const containerClassName = "w-full h-full p-4 lg:p-0"


const ResetPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { toast } = useToast();
    const navigate = useNavigate();


    const onSubmit = async () => {
        if (email) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify({ email });
            setIsLoading(true);
            try {
                const response = await axios.post('/api/auth/users/reset_password/', body, config);
                console.log('response: ', response);
                setIsOpen(true);
            } catch (error: unknown) {
                console.log('error:', error)
                setIsLoading(false);
                if (isAxiosError(error)) {
                    toast({
                        variant: "destructive",
                        title: "Reset Failed",
                        description: error.response?.data.detail,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Reset Failed",
                        description: (error as Error).message,
                    });
                }
            }
            setIsLoading(false);
        } else {
            toast({
                variant: "destructive",
                title: "Email is required",
            });
        }
    };

    const handleConfirm = () => {
        setIsOpen(false);
        navigate('/login');
    }

    return (
        <>
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/placeholder.svg"
                        alt="Image"
                        width="1920"
                        height="1080"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Reset Password</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to reset your password
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2 mb-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {isLoading ?
                                <Button disabled type="submit" className="w-full" onClick={onSubmit}>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please Wait
                                </Button>
                                :
                                <Button type="submit" className="w-full" onClick={onSubmit}>
                                    Reset
                                </Button>
                            }
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog open={isOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Password Reset Info Sent!</AlertDialogTitle>
                        <AlertDialogDescription>
                            The password reset link to reset your account password has been sent to your email at <span className="font-bold"> {email} </span>. Check your inbox.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default ResetPassword;