import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaArrowRight, FaTag } from "react-icons/fa";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of AI in Appointment Scheduling",
    excerpt:
      "Discover how artificial intelligence is revolutionizing the way businesses manage their calendars and reduce no-show rates.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Sarah Johnson",
    date: "Jan 10, 2026",
    category: "Technology",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "5 Strategies to Grow Your Service Business",
    excerpt:
      "Learn actionable tips to attract more clients, retain existing ones, and scale your service-based business efficiently.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Michael Chen",
    date: "Jan 05, 2026",
    category: "Business Growth",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Why Customer Experience is Your Best Marketing",
    excerpt:
      "In a competitive market, providing exceptional booking experiences can be your biggest differentiator.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Emily Davis",
    date: "Dec 28, 2025",
    category: "Customer Success",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Streamlining Operations with Automated Workflows",
    excerpt:
      "Stop doing manual tasks. Here is how to set up automated reminders, follow-ups, and payment processing.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "David Wilson",
    date: "Dec 15, 2025",
    category: "Productivity",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Ultimate Guide to Reducing No-Shows",
    excerpt:
      "No-shows cost money. Implement these proven strategies to ensure your clients show up on time, every time.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Sarah Johnson",
    date: "Dec 01, 2025",
    category: "Management",
    readTime: "4 min read",
  },
  {
    id: 6,
    title: "Slotcore 2.0: What is New?",
    excerpt:
      "A deep dive into our latest update featuring team collaboration tools, API access, and advanced analytics.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Slotcore Team",
    date: "Nov 20, 2025",
    category: "Product Update",
    readTime: "3 min read",
  },
];

export default function Blog() {
  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            Latest Insights
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Trends, strategies, and updates from the Slotcore team.
          </p>
        </div>

        {/* Featured Post (First one) */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 grid md:grid-cols-2 group hover:shadow-lg transition-shadow">
            <div className="h-64 md:h-auto overflow-hidden">
              <img
                src={BLOG_POSTS[0].image}
                alt={BLOG_POSTS[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                  {BLOG_POSTS[0].category}
                </span>
                <span className="text-neutral-500 flex items-center gap-1">
                  <FaCalendarAlt className="text-xs" /> {BLOG_POSTS[0].date}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-neutral-900 group-hover:text-primary-600 transition-colors">
                <Link to="#">{BLOG_POSTS[0].title}</Link>
              </h2>
              <p className="text-neutral-600 mb-6 text-lg line-clamp-2">
                {BLOG_POSTS[0].excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-xs">
                    <FaUser />
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {BLOG_POSTS[0].author}
                  </span>
                </div>
                <Link
                  to="#"
                  className="text-primary-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Read Article <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Post Grid (Remaining) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200 hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-neutral-900 text-xs font-bold rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {post.date}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  <Link to="#">{post.title}</Link>
                </h3>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">
                    {post.author}
                  </span>
                  <span className="text-primary-600 text-sm font-semibold group-hover:underline">
                    Read more
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-neutral-900 rounded-2xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-600 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-neutral-400 mb-8">
              Get the latest articles, resources, and updates delivered directly
              to your inbox. No spam, we promise.
            </p>

            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
