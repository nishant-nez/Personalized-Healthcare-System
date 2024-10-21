import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/api/axios";
import { AxiosError, isAxiosError } from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
        }
    }, [user]);

    return (

        <div className="container mx-auto mb-10 pt-32">
            {
                user &&
                <div className="container mx-auto">
                    <Card className="max-w-2xl mx-auto p-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">User Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-32 h-32">
                                        <AvatarImage src={user.image} alt={`${user.first_name} ${user.last_name}`} />
                                        <AvatarFallback>{user.first_name}{user.last_name}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                                            Change Avatar
                                        </Label>
                                        <Input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={updateImage}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </Label>
                                        <Input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </Label>
                                        <Input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        readOnly
                                        className="mt-1 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </Label>
                                    <Input
                                        type="text"
                                        id="role"
                                        value={user.is_superuser ? "Admin" : "User"}
                                        readOnly
                                        className="mt-1 bg-gray-100 capitalize"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {isLoading
                                ? <Button type="submit" disabled>
                                    <Loader2 />
                                </Button>
                                : <Button type="submit" onClick={updateName}>Save Changes</Button>
                            }
                        </CardFooter>
                    </Card>
                </div>
            }
        </div >
    )
}

export default Profile;