import axios from "@/api/axios";
import { IBlog } from "@/interfaces/IBlog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptySearchResults from "@/components/EmptySearchResults";
import BlogCard from "@/components/BlogCard";
import { ICategory } from "@/interfaces/ICategory";
import { useAuth } from "@/contexts/AuthContext";


const MyBlogs = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [search, setSearch] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isBlogLoading, setIsBlogLoading] = useState<boolean>(false);
    const [isCategoryLoading, setCategoryIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const filterBlogs = () => {
        if (search) {
            const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()) || blog.content.toLowerCase().includes(search.toLowerCase()));
            setBlogs(filteredBlogs);
        }
    };

    const fetchBlogs = async () => {
        setIsBlogLoading(true);
        let params = {};
        if (search !== '') {
            params = { ...params, search: search }
        }

        if (user) {
            try {
                const response = await axios.get(
                    `/api/blogs/user/${user.id}/`,
                    { params: params }
                );
                setBlogs(response.data);
                console.log(response.data)
                console.log(user)
                // setBlogs(response.data.filter((blog: IBlog) => blog.author.email === user?.email));
                setIsBlogLoading(false);
            } catch (err: unknown) {
                setIsBlogLoading(false);
                console.log('Error', err);
                if (err instanceof AxiosError) {
                    toast({
                        variant: "destructive",
                        title: `Error fetching blogs`,
                        description: err.message,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error fetching blogs",
                    });
                }
            }
        }
        setIsBlogLoading(false);
    };

    const fetchCategories = async () => {
        setCategoryIsLoading(true);

        try {
            const response = await axios.get(
                '/api/blogs/category/',
            );
            setCategories(response.data);
            setCategoryIsLoading(false);
        } catch (err: unknown) {
            setCategoryIsLoading(false);
            console.log('Error', err);
            if (err instanceof AxiosError) {
                toast({
                    variant: "destructive",
                    title: `Error fetching categories`,
                    description: err.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error fetching categories",
                });
            }
        }
        setCategoryIsLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (search === '') fetchBlogs();
    }, [search]);

    useEffect(() => {
        if (user) fetchBlogs();
    }, [user]);

    return (
        <>
            <div className="h-[35vh] flex flex-col content-center items-center justify-center">
                <div className="p-4 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Blogs</h1>
                    <p className="text-lg font-light pt-3 pb-4 text-center">
                        Search for Blogs about health.
                    </p>
                </div>
                <div className="w-[40%] mx-auto flex gap-4 items-center content-center justify-center">
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />


                    {isBlogLoading
                        ? <Button type="submit" className="py-4 px-8" onClick={filterBlogs} disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        </Button>
                        : <Button type="submit" className="py-4 px-6" onClick={filterBlogs}>
                            Search
                        </Button>
                    }
                </div>
            </div>

            <div className="container mx-auto mb-10">

                {/* Cards */}
                <div className="flex flex-wrap justify-center gap-8">
                    {blogs && blogs.map((blog) =>
                        <BlogCard blog={blog} isOwner={true} key={blog.id} />
                    )}
                </div>

                {(isBlogLoading || isCategoryLoading) && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
                {blogs.length === 0 && !isBlogLoading && !isCategoryLoading && <EmptySearchResults />}
            </div>
        </>
    );
}

export default MyBlogs;