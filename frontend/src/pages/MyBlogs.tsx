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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import BlogAddForm from "@/components/BlogAddForm";


const MyBlogs = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [search, setSearch] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
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
            <div className="my-14 flex flex-col content-center items-center justify-center">
                <div className="p-4 mt-14 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Blogs</h1>
                    <p className="text-lg font-light pt-3 pb-4 text-center">
                        Search for your Blogs.
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

            <div className="container mx-auto pb-10">

                {/* Cards */}
                <div className="flex flex-wrap justify-center gap-8">
                    {blogs && blogs.map((blog) =>
                        <BlogCard blog={blog} isOwner={true} key={blog.id} />
                    )}
                </div>

                {/* add form */}
                <div className="fixed bottom-10 right-10" onClick={() => setModalOpen(true)}>
                    <button className="inline-flex items-center justify-center transition-colors duration-150 bg-[#0f172a] rounded-full focus:shadow-outline hover:bg-[#272e3f] p-6">
                        <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 45.402 45.402">
                            <g>
                                <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                            </g>
                        </svg>
                    </button>
                </div>

                <Dialog open={modalOpen} onOpenChange={setModalOpen} >
                    <DialogContent className="sm:max-w-[1000px]">
                        <DialogHeader className="text-center sm:text-center">
                            <DialogTitle className="font-bold text-3xl">Add a new blog</DialogTitle>
                        </DialogHeader>
                        {/* form */}
                        <BlogAddForm categories={categories} setModalOpen={setModalOpen} fetchBlogs={fetchBlogs} />
                    </DialogContent>
                </Dialog>


                {(isBlogLoading || isCategoryLoading) && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
                {blogs.length === 0 && !isBlogLoading && !isCategoryLoading && <EmptySearchResults />}
            </div>
        </>
    );
}

export default MyBlogs;