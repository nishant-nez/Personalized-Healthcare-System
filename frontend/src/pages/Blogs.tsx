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
import { Badge } from "@/components/ui/badge";


const Blogs = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);
    const [search, setSearch] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
    const [isBlogLoading, setIsBlogLoading] = useState<boolean>(false);
    const [isCategoryLoading, setCategoryIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const filterBlogs = () => {
        if (search) {
            const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()) || blog.content.toLowerCase().includes(search.toLowerCase()));
            setFilteredBlogs(filteredBlogs);
        }
    };

    const handleClear = () => {
        setSearch("");
        setSelectedCategory([]);
        setFilteredBlogs(blogs);
    };

    const updateSelectedCategories = (id: number) => {
        if (selectedCategory.includes(id)) {
            setSelectedCategory(selectedCategory.filter((categoryId) => categoryId !== id));
        } else {
            setSelectedCategory([...selectedCategory, id]);
        }
    };

    const fetchBlogs = async () => {
        setIsBlogLoading(true);
        let params = {};
        if (search !== '') {
            params = { ...params, search: search }
        }

        try {
            const response = await axios.get(
                user ? `api/blogs/except/${user.id}/` : 'api/blogs/',
                { params: params }
            );
            setBlogs(response.data);
            setFilteredBlogs(response.data);
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
        if (selectedCategory.length > 0) {
            // filter the blogs using selected category
            const filteredBlogs: IBlog[] = [];
            blogs.map((blog) => {
                blog.categories.map((category) => {
                    if (selectedCategory.includes(category.id)) {
                        filteredBlogs.push(blog);
                    }
                });
            });
            setFilteredBlogs([...new Set(filteredBlogs)]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (search === '') fetchBlogs();
    }, [search]);

    useEffect(() => {
        if (user) {
            fetchBlogs();
        };
    }, [user]);

    return (
        <div className="max-h-screen">
            <div className="flex flex-col content-center items-center justify-center pt-44">
                <div className="p-4 w-[45%]">
                    <h1 className="text-4xl font-bold text-center">Blogs</h1>
                    <p className="text-lg font-light pt-3 pb-4 text-center">
                        Search for Blogs about health.
                    </p>
                </div>
                <div className="w-[40%] mx-auto flex gap-4 items-center content-center justify-center">
                    <Input
                        type="search"
                        placeholder="Search for blogs"
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

                <div className="flex gap-4 my-8 items-center">
                    {categories && categories.map((category) => {
                        return (
                            <Badge
                                onClick={() => {
                                    updateSelectedCategories(category.id);
                                }}
                                // className={`${selectedCategory.includes(category.id) ? 'bg-primary text-white' : 'bg-gray-50 text-primary'} border border-gray-400 hover:bg-primary hover:text-white p-2 px-3 justify-evenly items-center font-medium cursor-pointer rounded-xl`}
                                key={category.id}
                                variant={selectedCategory.includes(category.id) ? 'default' : 'outline'}
                                className="text-sm px-4 py-2 cursor-pointer"
                            >
                                {category.name}
                            </Badge>
                        )
                    })}

                    <div
                        className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                        onClick={handleClear}
                    >
                        X
                    </div>
                </div>
            </div>

            <div className="container mx-auto pb-10">

                {/* Cards */}
                <div className="flex flex-wrap justify-center gap-8">
                    {filteredBlogs && filteredBlogs.map((blog) =>
                        <BlogCard blog={blog} isOwner={false} key={blog.id} />
                    )}
                </div>

                {(isBlogLoading || isCategoryLoading) && <Loader2 className="mx-auto h-14 w-14 animate-spin" />}
                {filteredBlogs.length === 0 && !isBlogLoading && !isCategoryLoading && <EmptySearchResults />}
            </div>
        </div>
    );
}

export default Blogs;