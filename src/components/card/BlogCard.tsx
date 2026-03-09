import React from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

interface BlogCardProps {
  id?: string;
  img?: string | null;
  title: string;
  author?: string;
  likes: number; // actually views count from parent
  date: string;
  category?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  img,
  title,
  author,
  likes,
  date,
  category,
}) => {
  const content = (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer max-w-sm w-full mx-auto bg-white">
      <div className="relative h-48 bg-gray-100">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
            <span className="text-4xl">📿</span>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-md">
          <FiEye className="mr-1" />
          {likes.toLocaleString()}
        </div>

        {category && (
          <span className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {category}
          </span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 min-h-12 line-clamp-2">
          {title}
        </h2>

        <div className="flex justify-between items-center text-sm text-gray-500">
          {author && (
            <span className="font-medium text-blue-600 truncate max-w-[120px]">{author}</span>
          )}
          <span className={!author ? 'ml-auto' : ''}>{date}</span>
        </div>
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/blog/${id}`}>{content}</Link>;
  }

  return content;
};

export default BlogCard;

