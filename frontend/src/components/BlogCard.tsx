import { IBlog } from "@/interfaces/IBlog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import { Card } from "./ui/card";


const BlogCard = ({ blog, isOwner }: { blog: IBlog, isOwner: boolean }) => {
    return (
        <Card className="max-w-sm border-border bg-card rounded-lg shadow">
            <Link to={`/blogs/${blog.id}`}>
                <img
                    className="rounded-t-lg h-[250px] w-[450px] object-cover"
                    src={blog.image_url}
                    alt={blog.title}
                />
            </Link>
            <div className="p-5">
                <Link to={`/blogs/${blog.id}`}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-primary">{blog.title}</h5>
                </Link>
                <p className="mb-3 font-normal text-muted-foreground">{blog.content.slice(0, 100) + '...'}</p>
                <div className="mb-4 flex gap-2 cursor-pointer">
                    {blog.categories.map((item) =>
                        <Badge key={item.id} variant="outline">{item.name}</Badge>
                    )}
                </div>
                <Link to={`/blogs/${blog.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-accent bg-accent-foreground rounded-lg hover:bg-black">
                    Read more
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </Card>
    );
}

export default BlogCard;