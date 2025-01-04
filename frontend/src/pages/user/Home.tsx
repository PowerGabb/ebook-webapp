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

export default function Home() {
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [latestBooks, setLatestBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        if (response.status) {
          // Untuk sementara, kita gunakan data yang sama untuk populer dan terbaru
          // Nanti bisa disesuaikan dengan API yang sebenarnya
          setPopularBooks(response.data.slice(0, 4));
          setLatestBooks(response.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group relative overflow-hidden">
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
          <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
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
  );

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang di ReadBooks
        </h1>
        <p className="mt-2 text-gray-600">
          Temukan dan baca ribuan buku digital favorit Anda
        </p>
      </section>

      {/* Popular Books */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Buku Populer</h2>
          <Link
            to="/popular"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Latest Books */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Buku Terbaru</h2>
          <Link
            to="/latest"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latestBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}
