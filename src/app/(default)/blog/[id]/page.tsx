'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getBlogById, Blog } from '@/store/api/general/blog';
import BlogDetailClient from '@/components/client/BlogDetailClient';
import { BlogDetailSkeleton } from '@/components/skeletons';

// Client-side rendered blog detail page
export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false); // Prevent double fetch in React Strict Mode

  useEffect(() => {
    const fetchBlog = async () => {
      // Prevent duplicate API calls in development (React Strict Mode)
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);
        const response = await getBlogById(id);
        setBlog(response.blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }

    // Cleanup function to reset ref when component unmounts or ID changes
    return () => {
      hasFetched.current = false;
    };
  }, [id]);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !blog) {
    return notFound();
  }

  return <BlogDetailClient blog={blog} />;
}
