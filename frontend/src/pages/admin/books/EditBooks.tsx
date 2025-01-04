import React, { useState, useRef, useEffect } from 'react';
import { updateBook, getBookById } from '../services/books/apiBook';
import { getAllCategories } from '../services/categories/apiCategory';
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
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

interface BookCategory {
  bookId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

interface BookData {
  id: string;
  title: string;
  author: string;
  description: string | null;
  coverImage: string | null;
  totalPages: number;
  isPublished: boolean;
  fileBook: string | null;
  createdAt: string;
  updatedAt: string;
  categories: BookCategory[];
  isbn: string | null;
  publisher: string | null;
  publishedAt: string | null;
}

export default function EditBooks() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const [description, setDescription] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
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

  // Fetch book data and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch book data
        if (id) {
          const bookResponse = await getBookById(id);
          if (bookResponse.status) {
            const bookData: BookData = bookResponse.data;
            setTitle(bookData.title);
            setAuthor(bookData.author);
            setDescription(bookData.description || '');
            setIsbn(bookData.isbn || '');
            setPublisher(bookData.publisher || '');
            setTotalPages(bookData.totalPages);
            setIsPublished(bookData.isPublished);
            setPublishedAt(bookData.publishedAt ? new Date(bookData.publishedAt).toISOString().split('T')[0] : '');
            
            // Set categories and selected categories
            const categoryIds = bookData.categories.map(cat => cat.categoryId);
            const selectedCats = bookData.categories.map(cat => cat.category);
            setCategories(categoryIds);
            setSelectedCategories(selectedCats);

            if (bookData.coverImage) {
              setCoverPreview(`http://localhost:3000/public/${bookData.coverImage}`);
            }
          }
        }

        // Fetch categories
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.status) {
          setAvailableCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal memuat data buku');
      }
    };
    fetchData();
  }, [id]);

  const filteredCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryChange = (categoryId: string) => {
    setCategories(prev => {
      if (prev.includes(categoryId)) {
        setSelectedCategories(current => 
          current.filter(cat => cat.id !== categoryId)
        );
        return prev.filter(id => id !== categoryId);
      }
      const categoryToAdd = availableCategories.find(cat => cat.id === categoryId);
      if (categoryToAdd) {
        setSelectedCategories(current => [...current, categoryToAdd]);
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
    if (!id) return;
    
    setError(null);
    setLoading(true);

    try {
      if (categories.length === 0) {
        throw new Error('Pilih minimal satu kategori');
      }

      const bookData = {
        title,
        author,
        description,
        categories,
        ...(coverImage && { coverImage }),
        ...(epubFile && { epubFile }),
        isbn,
        publisher,
        totalPages,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      };
      
      await updateBook(id, bookData);
      
      // Ganti alert dengan toast
      toast.success('Buku berhasil diperbarui!');
      // Redirect ke halaman list buku
      navigate('/admin/books');
      
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat memperbarui buku');
      // Tambahkan toast error
      toast.error(error.message || 'Terjadi kesalahan saat memperbarui buku');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl mb-5 font-bold">Edit Buku</h1>

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
                  {selectedCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
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
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="epubFile">File EPUB (Opsional)</Label>
                <Input
                  id="epubFile"
                  type="file"
                  accept=".epub"
                  onChange={(e) => setEpubFile(e.target.files?.[0] || null)}
                  className="border-gray-300"
                />
                <p className="text-sm text-gray-500">Biarkan kosong jika tidak ingin mengubah file epub</p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                          Klik untuk upload cover buku baru
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
