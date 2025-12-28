import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    coverImage: string;
    category: string;
}

interface BlogCardProps {
    post: BlogPost;
    className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={cn(
                "group flex flex-col bg-neutral-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300",
                className
            )}
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                    {post.category}
                </div>
            </div>

            <div className="flex flex-col flex-1 p-6">
                <div className="text-xs text-neutral-400 mb-3">{post.date}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Read Story <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
