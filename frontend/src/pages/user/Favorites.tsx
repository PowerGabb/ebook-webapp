import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Book, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'

interface Book {
  id: string
  book: {
    id: string
    title: string
    author: string
    coverImage: string | null
    categories: {
      category: {
        id: string
        name: string
      }
    }[]
  }
  createdAt: string
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await apiCall('/book/favorites/list', {
        method: 'GET'
      });
      
      if (response.status) {
        setFavorites(response.data);
      } else {
        toast.error('Gagal memuat daftar favorit');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Terjadi kesalahan saat memuat daftar favorit');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (bookId: string) => {
    try {
      const response = await apiCall(`/book/favorites/${bookId}`, {
        method: 'POST'
      });

      if (response.status) {
        // Refresh daftar favorit
        fetchFavorites();
        toast.success('Buku berhasil dihapus dari favorit');
      } else {
        toast.error('Gagal menghapus buku dari favorit');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Terjadi kesalahan saat menghapus dari favorit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat daftar favorit...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Buku Favorit
        </h2>
        <p className="text-gray-600 mb-4">
          Anda belum menambahkan buku ke daftar favorit
        </p>
        <Link
          to="/search"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Jelajahi Buku
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Buku Favorit Saya</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="group relative overflow-hidden">
            <Link to={`/books/${favorite.book.id}`}>
              <div className="aspect-[3/4] relative overflow-hidden">
                {favorite.book.coverImage ? (
                  <img
                    src={`http://localhost:3000/public${favorite.book.coverImage}`}
                    alt={favorite.book.title}
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
                    handleRemoveFromFavorites(favorite.book.id);
                  }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 line-clamp-1">
                  {favorite.book.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{favorite.book.author}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {favorite.book.categories.map((cat) => (
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