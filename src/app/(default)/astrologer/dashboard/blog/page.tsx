"use client";

import React, { useState, useEffect, useCallback } from "react";

import { colors } from "@/utils/colors";

import BlogCard from "@/components/card/BlogCard";

import {
  createBlog,
  getMyBlogs,
  deleteBlog,
  updateBlog,
  Blog as TBlog,
  BlogListResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
} from "@/store/api/astrologer/blog";

import Toast from "@/components/atoms/Toast";

import Input from "@/components/atoms/Input";

import Textarea from "@/components/atoms/Textarea";

import Button from "@/components/atoms/Button";

import {
  FiUploadCloud,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
} from "react-icons/fi";

import { MyBlogSkeleton } from "@/components/skeletons";
import { UpdateBlogModal } from "@/components/modals/updateBlog";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { BlogDetailsModal } from "@/components/modals/BlogDetailsModal";
import { useToast } from "@/hooks/useToast";

// --- Type Definitions ---

type ViewState = "list" | "create";

// --- Sub-Component: Create Blog Form ---

interface CreateBlogFormProps {
  onPostSuccess: () => void;

  onCancel: () => void;
}

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({
  onPostSuccess,

  onCancel,
}) => {
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    message: string;

    type: "success" | "error";
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
      e.target.value = "";

      setToast({
        message: "Please select a valid image file (png, jpg, jpeg).",

        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !imageFile) {
      setToast({
        message: "Title, Content, and Image are required.",

        type: "error",
      });

      return;
    }

    setLoading(true);

    try {
      const data: CreateBlogRequest = {
        title: title.trim(),

        description: content.trim(),

        image: imageFile,
      };

      await createBlog(data);

      setToast({ message: "Blog posted successfully!", type: "success" });

      // Clear form

      setTitle("");

      setContent("");

      setImageFile(null);
      
      setImagePreview("");

      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => onPostSuccess(), 1000);
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to post blog. Please try again.";

      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl px-6 mx-auto bg-white rounded-lg shadow-xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
        Post New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title (Using Input component) */}

        <Input
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the main title"
          required
          disabled={loading}
        />

        {/* Content (Using Textarea component) */}

        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post content here..."
          rows={6} // Added rows prop for initial height
          required
          disabled={loading}
        />

        {/* Image Upload (Kept native for File functionality, styled for design consistency) */}

        <div className="block">
          <span className="text-gray-700 font-medium block mb-2">Image</span>

          <div
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            {imagePreview ? (
              <div className="space-y-2 text-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-md max-h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">{imageFile?.name}</p>
                <p className="text-xs text-gray-500">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />

                <div className="flex text-sm text-gray-600">
                  <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    Click to upload or drag and drop
                  </span>
                </div>

                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end mb-4 space-x-4">
          {/* Cancel Button (Using Button component) */}

          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>

          {/* Post Blog Button (Using Button component) */}

          <Button
            type="submit"
            variant="primary" // Will use the primary style defined in your Button component (yellow)
            loading={loading}
            disabled={loading}
          >
            Post Blog
          </Button>
        </div>
      </form>
    </div>
  );
};

// --- Main Component ---

export default function AstrologerBlogPage() {
  const [view, setView] = useState<ViewState>("list");

  const [blogs, setBlogs] = useState<TBlog[]>([]);

  const [loading, setLoading] = useState(true);

  const { toast, showToast, hideToast } = useToast();

  // Modal states
  const [selectedBlog, setSelectedBlog] = useState<TBlog | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMyBlogs = useCallback(async () => {
    setLoading(true);

    try {
      const response: BlogListResponse = await getMyBlogs();

      setBlogs(response.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);

      showToast("Failed to fetch blogs.", "error");

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleDeleteBlog = async (id: string) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteBlog(blogToDelete);

      showToast("Blog deleted successfully!", "success");

      fetchMyBlogs(); // Refresh list
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      showToast("Failed to delete blog.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditBlog = (blog: TBlog) => {
    setSelectedBlog(blog);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateBlog = async (id: string, data: UpdateBlogRequest) => {
    try {
      await updateBlog(id, data);
      showToast("Blog updated successfully!", "success");
      fetchMyBlogs();
      setIsUpdateModalOpen(false);
      setSelectedBlog(null);
    } catch (error: any) {
      showToast(error.message || "Failed to update blog.", "error");
      throw error;
    }
  };

  const handleBlogClick = (blog: TBlog) => {
    setSelectedBlog(blog);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    if (view === "list") {
      fetchMyBlogs();
    }
  }, [view, fetchMyBlogs]);

  const handlePostSuccess = () => {
    setView("list");

    fetchMyBlogs();
  };

  // --- Render Logic ---

  const renderContent = () => {
    if (view === "create") {
      return (
        <CreateBlogForm
          onPostSuccess={handlePostSuccess}
          onCancel={() => setView("list")}
        />
      );
    }

    // Blog List View (Default)

    if (loading) {
      return <MyBlogSkeleton />;
    }

    if (blogs.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center py-12">
          <FiFileText className="w-24 h-24 mx-auto mb-4 text-gray-400" />

          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: colors.black }}
          >
            No Blog Posts Found
          </h2>

          <p className="text-gray-600">
            Start sharing your wisdom by creating your first blog post!
          </p>
        </div>
      );
    }

    // Display Blog Cards

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id || blog._id} className="relative group">
            <div
              onClick={() => handleBlogClick(blog)}
              className="cursor-pointer"
            >
              <BlogCard
                img={blog.image}
                title={blog.title}
                likes={blog.likes}
                date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",

                  day: "numeric",

                  year: "numeric",
                })}
              />
            </div>

            {/* Action buttons (Edit/Delete) - Only shown on hover or permanently */}

            <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="custom"
                customColors={{
                  backgroundColor: "rgba(59, 130, 246, 0.9)", // bg-blue-500

                  textColor: "white",

                  hoverBackgroundColor: "rgba(29, 78, 216, 0.9)", // dark blue
                }}
                className="p-2 rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditBlog(blog);
                }}
                icon={<FiEdit2 className="w-5 h-5" />}
              >
                {""}
              </Button>

              <Button
                size="sm"
                variant="custom"
                customColors={{
                  backgroundColor: "rgba(239, 68, 68, 0.9)", // bg-red-500

                  textColor: "white",

                  hoverBackgroundColor: "rgba(185, 28, 28, 0.9)", // dark red
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBlog(blog.id || blog._id);
                }}
                className="p-2 rounded-full shadow-md"
                icon={<FiTrash2 className="w-5 h-5" />}
              >
                {""}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-8">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* Update Blog Modal */}
      <UpdateBlogModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedBlog(null);
        }}
        onUpdate={handleUpdateBlog}
        blog={selectedBlog}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={confirmDeleteBlog}
        loading={deleteLoading}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
      />

      {/* Blog Details Modal */}
      <BlogDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBlog(null);
        }}
        blog={selectedBlog}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
            My Blogs
          </h1>

          {view === "list" && (
            <Button
              onClick={() => setView("create")}
              variant="primary" // Uses the primary variant for the yellow button
              className="flex items-center space-x-2 shadow-md"
            >
              <FiPlus className="w-5 h-5" />

              <span>Create new Blog</span>
            </Button>
          )}

          {view === "create" && (
            <Button onClick={() => setView("list")} variant="secondary">
              Back to List
            </Button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
