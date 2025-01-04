import React, { useState, useRef, useEffect } from 'react';
import { createBook } from '../services/books/apiBook';
import { getAllCategories } from '../services/categories/apiCategory';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CreateBooks() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string>('');

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch categories saat komponen dimount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.status) {
          setAvailableCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryChange = (categoryId: string) => {
    setCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!coverImage || !epubFile) {
        throw new Error('Harap upload cover image dan file epub');
      }

      if (categories.length === 0) {
        throw new Error('Pilih minimal satu kategori');
      }

      const bookData = {
        title,
        author,
        description,
        categories,
        coverImage,
        epubFile,
        isbn,
        publisher,
        totalPages,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      };
      
      await createBook(bookData);
      
      // Reset form setelah berhasil
      setTitle('');
      setAuthor('');
      setDescription('');
      setCategories([]);
      setCoverImage(null);
      setEpubFile(null);
      setCoverPreview(null);
      setIsbn('');
      setPublisher('');
      setTotalPages(0);
      setIsPublished(false);
      setPublishedAt('');
      
      // Ganti alert dengan toast
      toast.success('Buku berhasil ditambahkan!');
      
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat menambahkan buku');
      // Tambahkan toast error
      toast.error(error.message || 'Terjadi kesalahan saat menambahkan buku');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl mb-5 font-bold">Tambah Buku Baru</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Form Bagian Kiri */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Buku</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-300"
                  placeholder="Masukkan judul buku"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="border-gray-300"
                  placeholder="Masukkan nama penulis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="border-gray-300"
                  placeholder="Masukkan ISBN buku"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Penerbit</Label>
                <Input
                  id="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="border-gray-300"
                  placeholder="Masukkan nama penerbit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPages">Jumlah Halaman</Label>
                <Input
                  id="totalPages"
                  type="number"
                  value={totalPages}
                  onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                  className="border-gray-300"
                  placeholder="Masukkan jumlah halaman"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="isPublished">Publikasikan</Label>
              </div>

              {isPublished && (
                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Tanggal Publikasi</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[100px]"
                  placeholder="Masukkan deskripsi buku"
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <div className="relative" ref={searchRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Cari kategori..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onClick={() => setIsSearchOpen(true)}
                      className="pl-10"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  </div>

                  {/* Dropdown untuk hasil pencarian */}
                  {isSearchOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {filteredCategories.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Kategori tidak ditemukan
                        </div>
                      ) : (
                        filteredCategories.map((category) => (
                          <div
                            key={category.id}
                            onClick={() => {
                              handleCategoryChange(category.id);
                              setSearchQuery('');
                            }}
                            className={cn(
                              "px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100",
                              categories.includes(category.id) && "bg-gray-50"
                            )}
                          >
                            <Check
                              className={cn(
                                "w-4 h-4",
                                categories.includes(category.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span>{category.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Categories */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((catId) => {
                    const category = availableCategories.find(cat => cat.id === catId);
                    return category ? (
                      <div
                        key={catId}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{category.name}</span>
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(catId)}
                          className="hover:bg-primary/20 rounded-full p-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="epubFile">File EPUB</Label>
                <Input
                  id="epubFile"
                  type="file"
                  accept=".epub"
                  onChange={(e) => setEpubFile(e.target.files?.[0] || null)}
                  required
                  className="border-gray-300"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Mengunggah...' : 'Tambah Buku'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Cover Bagian Kanan */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>Cover Buku</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {coverPreview ? (
                  <div className="relative aspect-[3/4] w-full">
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="object-cover rounded-lg w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setCoverPreview(null);
                        setCoverImage(null);
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverImage"
                      className="cursor-pointer text-gray-600 hover:text-gray-800"
                    >
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <div className="text-sm">
                          Klik untuk upload cover buku
                        </div>
                        <div className="text-xs text-gray-500">
                          PNG, JPG (Maks. 2MB)
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
