import axios from "@/api/axios";
import { IBlog } from "@/interfaces/IBlog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";


const BlogDetail = () => {
    const [blog, setBlog] = useState<IBlog | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0);
    const { access, isLoggedIn } = useAuth();
    const { id } = useParams();
    const { toast } = useToast();

    const handleLike = async () => {
        if (isLoggedIn) {
            setIsLikeLoading(true);
            const config = {
                headers: {
                    'Authorization': 'JWT ' + access,
                },
            };
            try {
                const response = await axios.post(
                    `/api/blogs/like/${id}/`,
                    {},
                    config,
                );
                toast({
                    variant: 'success',
                    description: response.data.message,
                });
                fetchLikes();
                setIsLikeLoading(false);
            } catch (err: unknown) {
                setIsLikeLoading(false);
                console.log('Error', err);
                if (err instanceof AxiosError) {
                    toast({
                        variant: "destructive",
                        title: `Error fetching blog`,
                        description: err.message,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error fetching blog",
                    });
                }
            }
            setIsLikeLoading(false);
        } else {
            toast({
                variant: 'default',
                description: 'Please login to like this blog.',
            });
        }
    }

    const fetchLikes = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`,
            },
            withCredentials: true,
        };

        if (blog) {
            try {
                const response = await axios.get(
                    `/api/blogs/like/${blog.id}/`,
                    config,
                );
                setLikes(response.data.likes);
                if (response.data.self_liked) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
                setIsLoading(false);
            } catch (err: unknown) {
                setIsLoading(false);
                console.log('Error', err);
                if (err instanceof AxiosError) {
                    toast({
                        variant: "destructive",
                        title: `Error fetching blog likes`,
                        description: err.message,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error fetching blog likes",
                    });
                }
            }
        }
        setIsLoading(false);
    }

    const fetchBlog = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(
                `/api/blogs/${id}/`,
            );
            setBlog(response.data);
            setIsLoading(false);
        } catch (err: unknown) {
            setIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching blog`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching blog",
                });
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBlog();
        fetchLikes();
    }, []);

    useEffect(() => {
        if (blog) fetchLikes();
    }, [blog, access]);

    return (
        <>
            <div className="container mx-auto px-40 pt-28 pb-10 min-h-screen bg-background">
                {blog &&
                    <div className="container mx-auto py-10">
                        <Card className="max-w-4xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold mb-4">{blog.title}</CardTitle>
                                <div className="flex items-center space-x-4 mb-4">
                                    <Avatar>
                                        <AvatarImage src={blog.author.image} alt={blog.author.first_name} />
                                        <AvatarFallback>{blog.author.first_name}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{blog.author.first_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(blog.created_at, "MMMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.categories.map(tag => (
                                        <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={blog.image_url}
                                    alt="Blog post cover image"
                                    width={800}
                                    height={400}
                                    className="w-full h-auto rounded-lg mb-6"
                                />
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLike}
                                        className={isLiked ? "text-red-500" : ""}
                                    >
                                        <Heart className="w-4 h-4 mr-2" fill={isLiked ? "currentColor" : "none"} />
                                        {
                                            isLikeLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Like'
                                        }
                                    </Button>
                                    <span>{likes} likes</span>
                                </div>
                                {/* <Button variant="outline" size="sm">
                                    Share
                                </Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                }
            </div>
            {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
        </>
    );
}

export default BlogDetail;