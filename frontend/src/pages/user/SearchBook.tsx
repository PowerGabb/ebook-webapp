import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Book, Heart, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllBooks } from '../admin/services/books/apiBook'
import { getAllCategories } from '../admin/services/categories/apiCategory'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  categories: any[];
}

interface Category {
  id: string;
  name: string;
}

export default function SearchBook() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          getAllBooks(),
          getAllCategories()
        ]);

        if (booksResponse.status && categoriesResponse.status) {
          setBooks(booksResponse.data);
          setFilteredBooks(booksResponse.data);
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter books based on search query and selected categories
    const filtered = books.filter(book => {
      const matchesSearch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategories = selectedCategories.length === 0 ||
        selectedCategories.every(categoryId =>
          book.categories.some(cat => cat.category.id === categoryId)
        );

      return matchesSearch && matchesCategories;
    });

    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategories, books]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari judul buku atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Filter Kategori</h3>
            {(selectedCategories.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Hapus Filter
                <X className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:opacity-80",
                  selectedCategories.includes(category.id)
                    ? "bg-blue-500"
                    : "hover:bg-gray-100"
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Hasil Pencarian
          </h2>
          <p className="text-sm text-gray-600">
            Ditemukan {filteredBooks.length} buku
          </p>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada buku yang ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci atau filter kategori
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group relative overflow-hidden">
                <Link to={`/books/${book.id}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={`http://localhost:3000/public/${book.coverImage}`}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Book className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <button 
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle add to favorites
                      }}
                    >
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {book.categories.map((cat: any) => (
                        <span
                          key={cat.category.id}
                          className="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
                        >
                          {cat.category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 