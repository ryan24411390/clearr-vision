import { useTranslations } from 'next-intl';
import { BlogCard } from '@/components/blog/blog-card';

// Mock data - in a real app this would come from a database or CMS
const BLOG_POSTS = [
    {
        slug: 'choosing-the-right-frames',
        title: 'How to Choose the Right Frames for Your Face Shape',
        excerpt: 'Finding the perfect pair of glasses is about balancing proportions and contrasting features. Here is our guide to face shapes.',
        date: 'Dec 24, 2025',
        coverImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2680&auto=format&fit=crop',
        category: 'Style Guide'
    },
    {
        slug: 'benefits-of-blue-light-glasses',
        title: 'Why You Need Blue Light Blocking Glasses',
        excerpt: 'Digital eye strain is a growing problem. Learn how blue light blocking technology can protect your eyes and improve sleep.',
        date: 'Dec 22, 2025',
        coverImage: 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2670&auto=format&fit=crop',
        category: 'Health'
    },
    {
        slug: 'care-for-your-glasses',
        title: '5 Tips to Make Your Glasses Last Longer',
        excerpt: 'Proper care can extend the life of your eyewear. Discover the do\'s and don\'ts of cleaning and storing your glasses.',
        date: 'Dec 18, 2025',
        coverImage: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=2572&auto=format&fit=crop',
        category: 'Care Tips'
    }
];

export default function BlogIndexPage() {
    const t = useTranslations('Blog');

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
