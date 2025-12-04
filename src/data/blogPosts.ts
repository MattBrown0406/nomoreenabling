export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Codependency: The First Step to Freedom",
    excerpt: "Learn to recognize the signs of codependent behavior and discover how self-awareness can be your greatest tool for change.",
    category: "Self-Worth",
    readTime: "8 min read",
    date: "Dec 1, 2024",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop",
    slug: "understanding-codependency",
  },
  {
    id: "2",
    title: "How to Set Healthy Boundaries Without Feeling Guilty",
    excerpt: "Boundaries aren't walls—they're bridges to healthier relationships. Here's how to establish them with compassion.",
    category: "Boundaries",
    readTime: "6 min read",
    date: "Nov 28, 2024",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
    slug: "healthy-boundaries-without-guilt",
  },
  {
    id: "3",
    title: "Breaking the Cycle: When Helping Becomes Hurting",
    excerpt: "There's a fine line between support and enabling. Learn to distinguish between the two and how to truly help.",
    category: "Relationships",
    readTime: "7 min read",
    date: "Nov 25, 2024",
    image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop",
    slug: "breaking-the-cycle",
  },
  {
    id: "4",
    title: "Self-Care Isn't Selfish: Prioritizing Your Well-Being",
    excerpt: "You can't pour from an empty cup. Discover why taking care of yourself first is essential for healthy relationships.",
    category: "Personal Growth",
    readTime: "5 min read",
    date: "Nov 22, 2024",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop",
    slug: "self-care-isnt-selfish",
  },
  {
    id: "5",
    title: "Navigating Recovery: A Journey to Self-Discovery",
    excerpt: "Recovery from enabling behaviors is a process. Here are the stages you might experience and how to navigate them.",
    category: "Recovery",
    readTime: "10 min read",
    date: "Nov 18, 2024",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    slug: "navigating-recovery",
  },
  {
    id: "6",
    title: "Communication Strategies for Difficult Conversations",
    excerpt: "Learn effective communication techniques that help you express your needs while maintaining respect and connection.",
    category: "Relationships",
    readTime: "6 min read",
    date: "Nov 15, 2024",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop",
    slug: "communication-strategies",
  },
];
