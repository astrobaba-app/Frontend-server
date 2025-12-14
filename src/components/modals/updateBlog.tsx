import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import { Blog, UpdateBlogRequest } from '@/store/api/astrologer/blog';
import Image from 'next/image';

interface UpdateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateBlogRequest) => Promise<void>;
  blog: Blog | null;
}

export const UpdateBlogModal: React.FC<UpdateBlogModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  blog,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setImagePreview(blog.image);
      setImageFile(null);
    }
  }, [blog]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    } else {
      setImageFile(null);
      setError('Please select a valid image file (png, jpg, jpeg).');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Title and Description are required.');
      return;
    }

    if (!blog) return;

    setLoading(true);
    setError('');

    try {
      const updateData: UpdateBlogRequest = {
        title: title.trim(),
        description: description.trim(),
      };

      if (imageFile) {
        updateData.image = imageFile;
      }

      await onUpdate(blog.id || blog._id, updateData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Update Blog</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <Input
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <Textarea
              label="Content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your blog content here..."
              rows={8}
              required
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Image
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Blog preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Upload Button */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors border-gray-300"
              onClick={() => document.getElementById('update-image-upload')?.click()}
            >
              <input
                id="update-image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              
              <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                {imageFile ? imageFile.name : 'Click to change image'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG (max. 5MB)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Update Blog
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
