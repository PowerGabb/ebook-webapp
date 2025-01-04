import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Book, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllBooks } from '../admin/services/books/apiBook'

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  categories: any[];
}

export default function Latest() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        if (response.status) {
          // Untuk sementara, kita gunakan semua buku
          // Nanti bisa disesuaikan dengan API getLatestBooks
          setBooks(response.data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buku Terbaru</h1>
        <div className="text-sm text-gray-600">
          Menampilkan {books.length} buku terbaru
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
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
    </div>
  )
} 