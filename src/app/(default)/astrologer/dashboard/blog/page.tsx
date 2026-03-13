"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit2, FiEye, FiFileText, FiImage, FiPlus, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import { colors } from "@/utils/colors";
import BlogCard from "@/components/card/BlogCard";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import { MyBlogSkeleton } from "@/components/skeletons";
import { useToast } from "@/hooks/useToast";
import {
  Blog as TBlog,
  createBlog,
  deleteBlog,
  getMyBlogs,
  toggleBlogPublish,
  updateBlog,
  uploadInlineImage,
} from "@/store/api/astrologer/blog";

type BlockType = "heading2" | "heading3" | "paragraph" | "bullets" | "quote" | "image";

interface ContentBlock {
  id: string;
  type: BlockType;
  content?: string;
  items?: string[];
  imageUrl?: string;
  uploading?: boolean;
}

const CATEGORIES = [
  "Love & Relationships",
  "Kundli & Birth Chart",
  "Zodiac Signs",
  "Spirituality",
  "Tarot & Divination",
  "Palm Reading",
  "Vedic Astrology",
  "Numerology",
  "Vastu Shastra",
  "Festivals & Muhurat",
  "Career & Finance",
  "Health & Wellness",
  "General",
];

const BLOCK_LABELS: Record<BlockType, string> = {
  heading2: "Section Heading",
  heading3: "Sub-Heading",
  paragraph: "Paragraph",
  bullets: "Bullet Points",
  quote: "Quote",
  image: "Image",
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function serializeBlocks(blocks: ContentBlock[]): string {
  return JSON.stringify(blocks.map(({ uploading: _u, ...rest }) => rest));
}

function deserializeBlocks(raw: string): ContentBlock[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({ ...item, id: item.id || generateId() }));
    }
  } catch {
    if (raw?.trim()) {
      return [{ id: generateId(), type: "paragraph", content: raw }];
    }
  }
  return [];
}

function hasBlockContent(blocks: ContentBlock[]): boolean {
  return blocks.some((block) => {
    if (block.type === "image") return !!block.imageUrl;
    if (block.type === "bullets") return (block.items || []).some((item) => item.trim());
    return !!block.content?.trim();
  });
}

function renderBlocks(description: string) {
  try {
    const blocks: ContentBlock[] = JSON.parse(description);
    if (!Array.isArray(blocks)) throw new Error("Invalid blocks");

    return blocks.map((block, i) => {
      if (block.type === "heading2") {
        return (
          <h2 key={i} className="text-xl font-bold text-gray-900 mt-5 mb-2">
            {block.content}
          </h2>
        );
      }
      if (block.type === "heading3") {
        return (
          <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-1.5">
            {block.content}
          </h3>
        );
      }
      if (block.type === "quote") {
        return (
          <blockquote key={i} className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 my-3">
            {block.content}
          </blockquote>
        );
      }
      if (block.type === "bullets") {
        return (
          <ul key={i} className="list-disc list-inside space-y-1 my-3 text-gray-700">
            {(block.items || []).map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        );
      }
      if (block.type === "image" && block.imageUrl) {
        return (
          <div key={i} className="my-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <img src={block.imageUrl} alt="Blog content" className="w-full max-h-96 object-contain" />
          </div>
        );
      }
      return (
        <p key={i} className="text-gray-700 leading-relaxed my-3">
          {block.content}
        </p>
      );
    });
  } catch {
    return <p className="text-gray-700 whitespace-pre-wrap">{description}</p>;
  }
}

interface ContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

function ContentEditor({ blocks, onChange }: ContentEditorProps) {
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock =
      type === "bullets"
        ? { id: generateId(), type, items: [""] }
        : type === "image"
        ? { id: generateId(), type, imageUrl: "" }
        : { id: generateId(), type, content: "" };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, patch: Partial<ContentBlock>) => {
    onChange(blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((block) => block.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === blocks.length - 1) return;
    const next = [...blocks];
    const swapIndex = direction === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swapIndex]] = [next[swapIndex], next[idx]];
    onChange(next);
  };

  const updateBullet = (blockId: string, itemIndex: number, value: string) => {
    const block = blocks.find((item) => item.id === blockId);
    if (!block?.items) return;
    const nextItems = [...block.items];
    nextItems[itemIndex] = value;
    updateBlock(blockId, { items: nextItems });
  };

  const addBullet = (blockId: string) => {
    const block = blocks.find((item) => item.id === blockId);
    if (!block?.items) return;
    updateBlock(blockId, { items: [...block.items, ""] });
  };

  const removeBullet = (blockId: string, itemIndex: number) => {
    const block = blocks.find((item) => item.id === blockId);
    if (!block?.items) return;
    updateBlock(blockId, { items: block.items.filter((_, idx) => idx !== itemIndex) });
  };

  const uploadBlockImage = async (blockId: string, file: File) => {
    updateBlock(blockId, { uploading: true });
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadInlineImage(formData);
      updateBlock(blockId, { uploading: false, imageUrl: response.url });
    } catch {
      updateBlock(blockId, { uploading: false });
    }
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => (
        <div key={block.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">{BLOCK_LABELS[block.type]}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveBlock(block.id, "up")}
                disabled={idx === 0}
                className="text-xs px-2 py-1 border rounded disabled:opacity-40"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveBlock(block.id, "down")}
                disabled={idx === blocks.length - 1}
                className="text-xs px-2 py-1 border rounded disabled:opacity-40"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="text-xs px-2 py-1 border rounded text-red-600 border-red-200"
              >
                Remove
              </button>
            </div>
          </div>

          {block.type === "bullets" ? (
            <div className="space-y-2">
              {(block.items || [""]).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={item}
                    onChange={(e) => updateBullet(block.id, i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder={`Bullet ${i + 1}`}
                  />
                  {(block.items || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(block.id, i)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addBullet(block.id)} className="text-xs text-yellow-700 font-semibold">
                + Add bullet
              </button>
            </div>
          ) : block.type === "image" ? (
            <div>
              {block.uploading ? (
                <div className="h-28 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  Uploading image...
                </div>
              ) : block.imageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img src={block.imageUrl} alt="content" className="w-full max-h-80 object-contain bg-gray-50" />
                  <button
                    type="button"
                    onClick={() => updateBlock(block.id, { imageUrl: "" })}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <label className="h-28 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500">
                  <FiUploadCloud className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-1">Upload content image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadBlockImage(block.id, file);
                    }}
                  />
                </label>
              )}
            </div>
          ) : (
            <textarea
              value={block.content || ""}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              rows={block.type === "paragraph" ? 4 : 2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder={
                block.type === "heading2"
                  ? "Section heading"
                  : block.type === "heading3"
                  ? "Sub-heading"
                  : block.type === "quote"
                  ? "Quote"
                  : "Write content"
              }
            />
          )}
        </div>
      ))}

      <div className="border border-dashed border-gray-300 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">Add content block</p>
        <div className="flex flex-wrap gap-2">
          {(["heading2", "heading3", "paragraph", "bullets", "quote", "image"] as BlockType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="px-3 py-1.5 rounded-full border border-gray-300 text-xs hover:border-yellow-500"
            >
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface BlogFormModalProps {
  blog?: TBlog | null;
  onClose: () => void;
  onSaved: () => void;
}

function BlogFormModal({ blog, onClose, onSaved }: BlogFormModalProps) {
  const isEdit = !!blog;
  const [title, setTitle] = useState(blog?.title || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? true);
  const [blocks, setBlocks] = useState<ContentBlock[]>(() =>
    blog?.description ? deserializeBlocks(blog.description) : []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    if (blog?.images && blog.images.length > 0) return blog.images;
    if (blog?.image) return [blog.image];
    return [];
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = Math.max(0, 5 - existingImages.length - newImages.length);
    const selectedFiles = files.slice(0, remainingSlots);

    setNewImages((prev) => [...prev, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreviews((prev) => [...prev, (e.target?.result as string) || ""]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    if (!hasBlockContent(blocks)) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: serializeBlocks(blocks),
        category: category || "",
        isPublished,
        images: newImages,
      };

      if (isEdit && blog) {
        await updateBlog(blog.id, payload);
      } else {
        await createBlog(payload);
      }

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: colors.offYellow }}>
          <h2 className="text-lg font-bold text-gray-800">{isEdit ? "Update Blog" : "Create New Blog"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                placeholder="Enter blog title"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Blog Images <span className="text-gray-400 font-normal">(up to 5)</span>
              </label>

              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newImagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {newImagePreviews.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-yellow-300 group">
                      <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {existingImages.length + newImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-yellow-500"
                >
                  Upload images
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={selectImages}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content *</label>
              <ContentEditor blocks={blocks} onChange={setBlocks} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-700">Publish Status</p>
                <p className="text-xs text-gray-500">{isPublished ? "Blog will be live" : "Blog will be draft"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished((prev) => !prev)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isPublished ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isPublished ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="px-5 py-2 text-sm border rounded-lg text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-bold rounded-lg text-black"
              style={{ backgroundColor: colors.primeYellow }}
            >
              {saving ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PreviewModalProps {
  blog: TBlog;
  onClose: () => void;
  onEdit: (blog: TBlog) => void;
  onDelete: (id: string) => void;
}

function PreviewModal({ blog, onClose, onEdit, onDelete }: PreviewModalProps) {
  const coverImage = blog.images && blog.images.length > 0 ? blog.images[0] : blog.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(blog)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Edit"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                onDelete(blog.id);
                onClose();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Delete"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {coverImage && (
            <div className="w-full rounded-lg overflow-hidden mb-6 border border-gray-200">
              <img src={coverImage} alt={blog.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          {blog.category && (
            <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-gray-700">
              {blog.category}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>{blog.views} views</span>
            <span>{blog.likes} likes</span>
            <span>{blog.isPublished ? "Published" : "Draft"}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">{renderBlocks(blog.description)}</div>
        </div>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  blog: TBlog;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function DeleteModal({ blog, onClose, onConfirm, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Blog?</h3>
        <p className="text-sm text-gray-600 mb-1">Are you sure you want to permanently delete:</p>
        <p className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg mb-6 line-clamp-2">
          &ldquo;{blog.title}&rdquo;
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AstrologerBlogPage() {
  const [blogs, setBlogs] = useState<TBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);
  const [previewBlog, setPreviewBlog] = useState<TBlog | null>(null);

  const [deletingBlog, setDeletingBlog] = useState<TBlog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const fetchMyBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyBlogs();
      setBlogs(response.blogs || []);
    } catch {
      setBlogs([]);
      showToast("Failed to fetch blogs.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  const handleDelete = async () => {
    if (!deletingBlog) return;
    setDeleteLoading(true);
    try {
      await deleteBlog(deletingBlog.id);
      showToast("Blog deleted successfully!", "success");
      setDeletingBlog(null);
      fetchMyBlogs();
    } catch {
      showToast("Failed to delete blog.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (blog: TBlog) => {
    try {
      await toggleBlogPublish(blog.id);
      showToast(blog.isPublished ? "Blog moved to draft." : "Blog published.", "success");
      fetchMyBlogs();
    } catch {
      showToast("Failed to update publish status.", "error");
    }
  };

  return (
    <div className="md:px-8">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {isFormOpen && (
        <BlogFormModal
          blog={editingBlog}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBlog(null);
          }}
          onSaved={() => {
            fetchMyBlogs();
            showToast(editingBlog ? "Blog updated successfully!" : "Blog created successfully!", "success");
          }}
        />
      )}

      {previewBlog && (
        <PreviewModal
          blog={previewBlog}
          onClose={() => setPreviewBlog(null)}
          onEdit={(blog) => {
            setPreviewBlog(null);
            setEditingBlog(blog);
            setIsFormOpen(true);
          }}
          onDelete={(id) => {
            const target = blogs.find((b) => b.id === id);
            if (target) setDeletingBlog(target);
          }}
        />
      )}

      {deletingBlog && (
        <DeleteModal
          blog={deletingBlog}
          loading={deleteLoading}
          onClose={() => setDeletingBlog(null)}
          onConfirm={handleDelete}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.black }}>
            My Blogs
          </h1>

          <Button
            onClick={() => {
              setEditingBlog(null);
              setIsFormOpen(true);
            }}
            variant="primary"
            className="flex items-center space-x-2 shadow-md"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create New Blog</span>
          </Button>
        </div>

        {loading ? (
          <MyBlogSkeleton />
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center py-12">
            <FiFileText className="w-24 h-24 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              No Blog Posts Found
            </h2>
            <p className="text-gray-600">Start sharing your wisdom by creating your first blog post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.map((blog) => {
              const coverImage = blog.images && blog.images.length > 0 ? blog.images[0] : blog.image;
              return (
                <div key={blog.id} className="relative group">
                  <div onClick={() => setPreviewBlog(blog)} className="cursor-pointer">
                    <BlogCard
                      img={coverImage}
                      title={blog.title}
                      likes={blog.views}
                      category={blog.category}
                      date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    />
                  </div>

                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        blog.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewBlog(blog);
                      }}
                      className="p-2 rounded-full shadow-md bg-white text-gray-700 hover:bg-gray-100"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBlog(blog);
                        setIsFormOpen(true);
                      }}
                      className="p-2 rounded-full shadow-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingBlog(blog);
                      }}
                      className="p-2 rounded-full shadow-md bg-red-500 text-white hover:bg-red-600"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublish(blog);
                      }}
                      className={`p-2 rounded-full shadow-md text-white ${
                        blog.isPublished ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                      title={blog.isPublished ? "Unpublish" : "Publish"}
                    >
                      <FiImage className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
