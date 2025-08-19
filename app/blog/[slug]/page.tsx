// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { dummyPosts } from "@/lib/dummy-posts";
import { Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await dummyPosts.find((p) => p.slug === params.slug);
    console.log(post);
    if (!post) return { title: "Not Found" };
    return { title: post.title, description: post.summary };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = dummyPosts.find((p) => p.slug === params.slug);

    if (!post) return notFound();

    return (
        <motion.article
            className="prose prose-invert dark:prose-invert max-w-3xl mx-auto py-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <header className="mb-6 border-b border-white/10 pb-4">
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                        <User size={14} /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> {post.date}
                    </span>
                </div>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <p>This is a dummy blog post. Replace with MDX or Notion content later.</p>
                <p>{post.summary}</p>
            </motion.section>
        </motion.article>
    );
}
