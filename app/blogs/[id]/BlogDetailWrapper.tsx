"use client"

import { useRouter } from 'next/navigation';
import BlogDetail from '@/components/BlogDetail';
import { Blog } from '@/lib/types';

export default function BlogDetailWrapper({ blog }: { blog: Blog }) {
    const router = useRouter();

    return (
        <BlogDetail
            blog={blog}
            onBack={() => router.push('/#blogs')}
        />
    );
}
