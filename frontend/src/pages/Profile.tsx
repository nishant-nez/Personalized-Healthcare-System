import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { AxiosError, isAxiosError } from "axios";

const Profile = () => {
    const { user, access, load_user } = useAuth();
    const [firstName, setFirstName] = useState(user?.first_name);
    const [lastName, setLastName] = useState(user?.last_name);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const updateImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            toast({
                variant: "destructive",
                title: "No file selected",
            });
            return;
        }
        const file = files[0];

        const formData = new FormData();
        formData.append("image", file);

        if (user) {
            try {
                const config = {
                    headers: {
                        'Authorization': 'JWT ' + access,
                    },
                };
                await axios.post(
                    `/api/auth/user/update-profile-image/${user?.id}/`,
                    formData,
                    config,
                );
                toast({
                    variant: "success",
                    title: "Profile Image Updated",
                });
                load_user();
            } catch (error) {
                setIsLoading(false);
                if (isAxiosError(error)) {
                    toast({
                        variant: "destructive",
                        title: "Error Updating Image",
                        description: error.response?.data.detail,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error Updating Image",
                        description: (error as Error).message,
                    });
                }
            }
        }
    };

    const updateName = async () => {
        setIsLoading(true);
        if (!firstName) {
            toast({
                variant: "destructive",
                title: `First Name is required`,
            });
            return;
        }
        if (!lastName) {
            toast({
                variant: "destructive",
                title: `Last Name is required`,
            });
            return;
        }
        if (firstName && lastName) {
            const config = {
                headers: {
                    'Authorization': 'JWT ' + access,
                },
            };
            try {
                await axios.post(
                    '/api/auth/user/update-name/',
                    { first_name: firstName, last_name: lastName },
                    config,
                );
                setIsLoading(false);
                toast({
                    variant: "success",
                    title: `Profile Updated Successfully`,
                });
            } catch (err: AxiosError | unknown) {
                setIsLoading(false);
                console.log('Error', err);
                toast({
                    variant: "destructive",
                    title: `Error Updating Profile`,
                });
            }
        }
        setIsLoading(false);
    };

    return (

        <div className="container mx-auto my-10 min-h-[86vh]">
            {
                user &&
                <div className="px-4 space-y-6 md:px-6">
                    <header className="space-y-1.5">
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.image}
                                alt="User Image"
                                width="96"
                                height="96"
                                className="border rounded-full"
                                style={{ aspectRatio: "96/96", objectFit: "cover" }}
                            />
                            <div className="space-y-1.5">
                                <h1 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {user.is_superuser ? "Admin" : "User"}
                                </p>
                            </div>
                        </div>
                    </header>
                    <div className="w-[220px]">
                        {/* <Button variant="outline" onClick={updateImage}> */}
                        <Input type="file" onChange={updateImage} accept="image/*" />
                        {/* </Button> */}
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input id="firstname" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input id="lastname" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="Enter your email" type="email" readOnly value={user.email} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        {isLoading
                            ? <Button type="submit" disabled>
                                <Loader2 />
                            </Button>
                            : <Button type="submit" onClick={updateName}>Save</Button>
                        }
                    </div>
                </div>
            }
        </div >
    )
}

export default Profile;