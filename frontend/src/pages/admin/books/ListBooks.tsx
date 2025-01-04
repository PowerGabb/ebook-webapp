import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Book, Pencil, Trash2, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteBook, getAllBooks } from '../services/books/apiBook'
import { toast } from "sonner"

interface Book {
  id: number
  coverImage: string
  title: string
  category: string
  author: string
  readCount: number
  categories: any
}

export default function ListBooks() {
  
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getListBooks = async () => {
      try {
        const response = await getAllBooks();
        if (response.status) {
          setBooks(response.data);
        } else {
          toast.error('Gagal memuat daftar buku');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat memuat daftar buku');
      }
    }
    getListBooks();
  }, []);

  const handleDeleteBook = async (id: number) => {
    try {
      const response = await deleteBook(id);
      if (response.status) {
        setBooks(books.filter((book) => book.id !== id));
        toast.success('Buku berhasil dihapus');
      } else {
        toast.error('Gagal menghapus buku');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus buku');
    }
  }

  const handleEditBook = (id: number) => {
    navigate(`/admin/books/edit/${id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Daftar Buku</h1>
        <Link to="/admin/books/create" className="flex items-center gap-2 md:px-4 px-2 md:py-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Buku
        </Link>
      </div>

      <div className="border rounded-lg bg-white shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Jumlah Baca</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book, index) => (
              <TableRow key={book.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  {book.coverImage ? (
                    <img 
                      src={`http://localhost:3000/public${book.coverImage}`}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Book className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.categories.map((category: any) => category.category.name).join(', ')}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.readCount}</TableCell>
                <TableCell>
                  <div  className="flex gap-2 justify-center">
                    <button onClick={() => handleEditBook(book.id)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteBook(book.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
