import React from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

interface BlogCardProps {
  id?: string;
  img: string;
  title: string;
  author?: string;
  likes: number; // This will actually be views from the parent
  date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  img,
  title,
  author,
  likes,
  date,
}) => {
  const content = (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer max-w-sm w-full mx-auto bg-white">
      <div className="relative h-48">
        <img src={img} alt={title} className="w-full h-full object-cover" />

        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-md">
          <FiEye className="mr-1" />
          {likes.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 min-h-12 line-clamp-2">
          {title}
        </h2>

        <div className="flex justify-between items-center text-sm text-gray-500">
          {author && (
            <span className="font-medium text-blue-600">{author}</span>
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
