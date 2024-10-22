import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { ICategory } from "@/interfaces/ICategory";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/api/axios";
import { useToast } from "./ui/use-toast";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(9999),
    categories: z.array(z.number()),
    image_url: z.instanceof(File),
});

const BlogAddForm = ({ categories, setModalOpen, fetchBlogs, }: { categories: ICategory[], setModalOpen: (arg0: boolean) => void, fetchBlogs: () => void, }) => {
    const { user, access } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('author', user?.id?.toString() || '');
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('image_url', values.image_url);
        values.categories.map((item) => formData.append('categories', item.toString()));

        try {
            const config = {
                headers: {
                    'Authorization': 'JWT ' + access,
                },
            };
            await axios.post(
                '/api/blogs/',
                formData,
                config,
            );
            setIsLoading(false);
            setModalOpen(false);
            toast({
                variant: "success",
                title: "Blog Created",
            });
            fetchBlogs();
        } catch (error) {
            setIsLoading(false);
            if (isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "Error creating Blog",
                    description: error.response?.data.detail,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error creating Blog",
                    description: (error as Error).message,
                });
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="m-8 mx-10">
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Blog Title" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Blog Content" {...field} rows={12} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categories</FormLabel>
                                <FormControl>
                                    <Select
                                        isMulti
                                        // styles={{
                                        //     control: (baseStyles, state) => ({
                                        //         ...baseStyles,
                                        // borderColor: state.isFocused ? 'red' : 'gray',
                                        // boxShadow: state.isFocused ? 0 : 0,
                                        // '&:hover': {
                                        //     border: state.isFocused ? 0 : 0
                                        // }
                                        // }),
                                        // }}
                                        options={categories.map(option => ({
                                            value: option.id,
                                            label: option.name,
                                        }))}
                                        onChange={(selectedOptions) => {
                                            const values = selectedOptions.map(option => option.value);
                                            field.onChange(values);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Image"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) {
                                                field.onChange(file);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center items-center">
                        {isLoading
                            ? <Button type="submit" disabled className="py-4 px-6">Submit</Button>
                            : <Button type="submit" className="py-4 px-6">Submit</Button>
                        }
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default BlogAddForm;