// components/DynamicBlog.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@prisma/client';
import { useAnalytics } from '@/components/AnalyticsProvider';

interface DynamicBlogProps {
  blogPosts: BlogPost[];
}

const DynamicBlogComponent: React.FC<DynamicBlogProps> = ({ blogPosts }) => {
  const analytics = useAnalytics();

  const handleBlogClick = (post: BlogPost) => {
    analytics?.trackEvent('blog_clicked', {
      postTitle: post.title,
      postSlug: post.slug,
      postTags: post.tags
    });
  };
  if (!blogPosts.length) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-6xl">📝</div>
          <h3 className="text-xl text-gray-300">Blog posts coming soon!</h3>
          <p className="text-gray-400">Stay tuned for insights, tutorials, and thoughts on development.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {blogPosts.find(post => post.views > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-1"
        >
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">
                Most Popular
              </span>
            </div>

            {blogPosts.find(post => post.views > 0) && (() => {
              const featuredPost = blogPosts.find(post => post.views > 0)!;
              return (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 hover:text-cyan-300 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-300 mb-4">{featuredPost.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                    {featuredPost.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredPost.readTime} min read
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {featuredPost.views} views
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.slice(0, 6).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
            onClick={() => handleBlogClick(post)}
          >
            {post.coverImage && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            <div className="p-6 space-y-3">
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="text-gray-300 text-sm line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}m
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye size={12} />
                  {post.views}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* View All Link */}
      {blogPosts.length > 6 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-600/30 transition-all duration-300"
          >
            View All Posts <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default DynamicBlogComponent;