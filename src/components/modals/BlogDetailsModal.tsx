import React from 'react';
import Button from '@/components/atoms/Button';
import { FiX, FiEdit2, FiTrash2, FiHeart, FiCalendar } from 'react-icons/fi';
import { Blog } from '@/store/api/astrologer/blog';
import Image from 'next/image';

interface BlogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

export const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({
  isOpen,
  onClose,
  blog,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header with Actions */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Blog Details</h2>
          <div className="flex items-center gap-2">
           
            
            
            {/* Delete Button */}
            <button
              onClick={() => {
                onDelete(blog.id || blog._id);
                onClose();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Blog"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Featured Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <FiHeart className="w-4 h-4" />
              <span className="text-sm">{blog.likes} Likes</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.description}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
           
            <Button
              onClick={onClose}
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
