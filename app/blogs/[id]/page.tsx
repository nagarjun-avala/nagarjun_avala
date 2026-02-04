import { MOCK_DATA } from '@/lib/data';
import { Blog } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import BlogDetailWrapper from './BlogDetailWrapper';

// Fetch Blog Data
async function getBlog(id: string): Promise<Blog | null> {
    try {
        let apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
        if (apiUri.startsWith('/')) {
            apiUri = "http://localhost:5000/api";
        }
        const res = await fetch(`${apiUri}/portfolio/blogs/${id}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        return null;
    }
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    return {
        title: `${blog.title} | Blog`,
        description: blog.title, // or extract excerpt from content
        openGraph: {
            images: blog.image ? [blog.image] : [],
        }
    };
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await getBlog(id);

    // Fallback to MOCK_DATA
    const displayBlog = blog || MOCK_DATA.blogs.find(b => b.id === id);

    if (!displayBlog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Blog Post Not Found</h1>
                    <p className="text-slate-500">The article you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar isDetailView={true} />
            <BlogDetailWrapper blog={displayBlog} />
        </div>
    );
}
