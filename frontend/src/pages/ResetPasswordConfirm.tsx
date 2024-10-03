import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { isAxiosError } from "axios";
import AuthImage from "@/components/AuthImage";


const ResetPasswordConfirm = () => {
    const [new_password, setNewPassword] = useState<string>('');
    const [re_new_password, setReNewPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const { uid, token } = useParams();

    const onSubmit = async () => {
        if (new_password && re_new_password) {
            if (new_password === re_new_password) {
                setIsLoading(true);

                try {
                    const config = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    };

                    await axios.post('/api/auth/users/reset_password_confirm/', { uid, token, new_password, re_new_password }, config);
                    setIsLoading(false);
                    navigate('/login');
                    toast({
                        variant: "success",
                        title: "Password Reset Successful",
                    });
                } catch (error: unknown) {
                    setIsLoading(false);
                    if (isAxiosError(error)) {
                        const data = error.response?.data;
                        for (const propName in data) {
                            if (Object.prototype.hasOwnProperty.call(data, propName)) {
                                const propValue = data[propName];
                                toast({
                                    variant: "destructive",
                                    title: "Password Reset Failed",
                                    description: propValue,
                                });
                            }
                        }
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Password Reset Failed",
                            description: (error as Error).message,
                        });
                    }
                }


            } else {
                toast({
                    variant: "destructive",
                    title: "The passwords did not match",
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "All fields are mandatory",
            });
        }
        setIsLoading(false);
    };


    return (
        <>
            <div className="w-full lg:grid lg:max-h-[600px] lg:grid-cols-2 xl:max-h-[800px]">
                <AuthImage />
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Change Password</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your new password
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="New Password"
                                    value={new_password}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="re_password">Re Password</Label>
                                <Input
                                    id="re_password"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={re_new_password}
                                    onChange={(e) => setReNewPassword(e.target.value)}
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
                                    Reset Password
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
        </>
    );
}

export default ResetPasswordConfirm;