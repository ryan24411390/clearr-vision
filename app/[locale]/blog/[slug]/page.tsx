import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const t = useTranslations('Blog');

    // In a real app, we would fetch the post data based on params.slug
    // For now, we'll use a static placeholder that simulates a rich article
    const post = {
        title: 'How to Choose the Right Frames for Your Face Shape',
        date: 'Dec 24, 2025',
        category: 'Style Guide',
        readTime: '5 min read',
        coverImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2680&auto=format&fit=crop',
        content: `
      <p>Finding the perfect pair of glasses is about balancing proportions and contrasting features. It's an art that combines personal style with the geometry of your face.</p>
      
      <h3>Round Face Shape</h3>
      <p>If you have a round face, you'll want to add definition. Angular frames like square or rectangular shapes work best. They add contrast to your soft features and can make your face appear longer and thinner.</p>
      
      <h3>Square Face Shape</h3>
      <p>For square faces with strong jawlines, the goal is to soften the angles. Round or oval frames are ideal as they balance the sharp lines of your face.</p>
      
      <h3>Oval Face Shape</h3>
      <p>Lucky you! Oval faces are the versatile universal blood type of face shapes. Almost any frame will look great, but ensuring the frame is as wide as the broadest part of your face usually yields the best results.</p>
      
      <h3>Heart Face Shape</h3>
      <p>Heart-shaped faces are widest at the forehead and narrowest at the chin. Frames that are wider at the bottom or have light colors can help balance the width of the forehead.</p>
    `
    };

    return (
        <article className="min-h-screen bg-neutral-950">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-16">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('back')}
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                            {post.category}
                        </span>
                        <span className="flex items-center text-sm text-white/80">
                            <Calendar className="w-4 h-4 mr-2" /> {post.date}
                        </span>
                        <span className="flex items-center text-sm text-white/80">
                            <Clock className="w-4 h-4 mr-2" /> {post.readTime}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 lg:col-start-3">
                        <div
                            className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-primary hover:prose-a:text-primary/80"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                            <div className="text-neutral-400">
                                Share this article
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
