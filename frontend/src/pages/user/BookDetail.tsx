import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Book as BookIcon, Heart, ArrowLeft, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBookById } from '../admin/services/books/apiBook'
import { toast } from "sonner"
import { apiCall } from '@/lib/api'
import { cn } from '@/lib/utils'

interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage: string | null
  categories: any[]
  publishedAt: string
  totalPages: number
  publisher: string
  isbn: string
}

interface ReadResponse {
  id: string
  readCount: number
  lastRead: string
  reader: {
    email: string
    name: string
  }
  book: {
    title: string
    author: string
    coverImage: string | null
    publisher: string
    isbn: string
  }
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) throw new Error('ID buku tidak ditemukan')
        const response = await getBookById(id)
        if (response.status) {
          setBook(response.data)
          // Cek status favorit
          checkFavoriteStatus(id)
        } else {
          throw new Error('Gagal memuat data buku')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const checkFavoriteStatus = async (bookId: string) => {
    try {
      const response = await apiCall(`/book/favorites/check/${bookId}`, {
        method: 'GET'
      });
      if (response.status) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!id) return;
      setFavoriteLoading(true);

      const response = await apiCall(`/book/favorites/${id}`, {
        method: 'POST'
      });

      if (response.status) {
        setIsFavorite(response.data.isFavorite);
        toast.success(response.data.isFavorite ? 
          'Buku berhasil ditambahkan ke favorit' : 
          'Buku berhasil dihapus dari favorit'
        );
      }
    } catch (error) {
      toast.error('Gagal memperbarui status favorit');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReadBook = async () => {
    try {
      if (!id) return;
      
      // Hit API untuk menambah riwayat baca
      const response = await apiCall(`/book/read/${id}`, {
        method: 'GET',
      });

      if (response.status) {
        // Tampilkan toast sukses dengan informasi
        toast.success(`Selamat membaca ${response.data.book.title}!`);
        // Redirect ke halaman baca
        navigate(`/books/${id}/read`);
      } else {
        throw new Error('Gagal menambahkan riwayat baca');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan saat mencatat riwayat baca');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data buku...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="text-center py-12">
        <BookIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Buku tidak ditemukan'}
        </h2>
        <Link to="/search" className="text-blue-600 hover:text-blue-700">
          Kembali ke pencarian
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to="/search"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke pencarian
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover and Actions */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            {book.coverImage ? (
              <img
                src={`http://localhost:3000/public${book.coverImage}`}
                alt={book.title}
                className="w-full aspect-[3/4] object-cover"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
                <BookIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </Card>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleReadBook}
            >
              Baca Sekarang
            </Button>
            <Button
              variant={isFavorite ? "default" : "outline"}
              className="w-full"
              size="lg"
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              <Heart className={cn("w-4 h-4 mr-2", isFavorite && "fill-current")} />
              {favoriteLoading ? 'Memproses...' : (isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit')}
            </Button>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {book.author}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(book.publishedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {book.categories.map((cat) => (
              <Badge key={cat.category.id} variant="secondary">
                {cat.category.name}
              </Badge>
            ))}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Tentang Buku</h2>
            <p className="text-gray-600 whitespace-pre-line">{book.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">Penerbit</h3>
              <p className="text-gray-600">{book.publisher}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Tanggal Terbit</h3>
              <p className="text-gray-600">
                {new Date(book.publishedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Jumlah Halaman</h3>
              <p className="text-gray-600">{book.totalPages} halaman</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">ISBN</h3>
              <p className="text-gray-600">{book.isbn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 