import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { isAxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import AuthImage from "@/components/AuthImage";

export const description =
    "A signup page with two columns. The first column has the signup form with name, email, password and re_password. The second column has a cover image."

export const iframeHeight = "800px"

export const containerClassName = "w-full h-full p-4 lg:p-0"


const Signup = () => {
    const [first_name, setFirstName] = useState<string>('');
    const [last_name, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [re_password, setRePassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const onSubmit = async () => {
        if (first_name && last_name && email && password && re_password) {
            if (password === re_password) {
                setIsLoading(true);

                try {
                    const config = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    };

                    await axios.post('/api/auth/users/', { first_name, last_name, email, password, re_password }, config);
                    setIsLoading(false);
                    navigate('/login');
                    toast({
                        variant: "success",
                        title: "Account Created Successfully",
                        description: "Check your email to activate your account",
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
                title: "All the fields are mandatory",
            });
        }
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        try {
            const response = await axios.get(`/api/auth/o/google-oauth2/?redirect_uri=${import.meta.env.VITE_FRONTEND_URL}`);
            // setIsGoogleLoading(false);
            window.location.replace(response.data.authorization_url)
        } catch (err) {
            // setIsGoogleLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            return navigate('/');
        }
    }, [isLoggedIn]);

    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2 pt-[80px]">
                <AuthImage />
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Signup</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your details to create a new account
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input
                                    id="fname"
                                    type="text"
                                    placeholder="First Name"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Last Name</Label>
                                <Input
                                    id="lname"
                                    type="text"
                                    placeholder="Last Name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
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
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="re_password">Confirm Password</Label>
                                <Input
                                    id="re_password"
                                    type="password"
                                    value={re_password}
                                    onChange={(e) => setRePassword(e.target.value)}
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
                                    Signup
                                </Button>
                            }
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
                                {isGoogleLoading ?
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    :
                                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                                }
                                <span>Continue with Google</span>
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;