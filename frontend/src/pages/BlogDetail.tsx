import axios from "@/api/axios";
import { IBlog } from "@/interfaces/IBlog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom";


const BlogDetail = () => {
    const [blog, setBlog] = useState<IBlog | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id } = useParams();
    const { toast } = useToast();

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
    }, []);

    return (
        <>
            <div className="container mx-auto px-40 my-10">
                {blog &&
                    <div>
                        <h1 className="text-3xl font-bold">{blog.title}</h1>
                        <div className="flex justify-between items-center mt-3 mb-4">
                            <p className="font-light italic">By {blog.author.first_name} {blog.author.last_name}</p>
                            <p className="font-light italic">On {new Date(blog.created_at).toDateString()}</p>
                        </div>
                        <div className="mb-4 flex gap-2 cursor-pointer">
                            {blog.categories.map((item) =>
                                <Badge key={item.id} variant="outline">{item.name}</Badge>
                            )}
                        </div>
                        <img src={blog.image_url} alt={blog.title} />
                        <p className="my-6">{blog.content}</p>
                    </div>
                }
            </div>
            {isLoading && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
        </>
    );
}

export default BlogDetail;