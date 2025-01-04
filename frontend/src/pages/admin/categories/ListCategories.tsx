import React, { useEffect ,useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteCategory, getAllCategories } from '../services/categories/apiCategory'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function ListCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.status) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    const response = await deleteCategory(id);
    if (response.status) {
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
      toast.success('Kategori berhasil dihapus');
    } else {
      toast.error('Gagal menghapus kategori');
    }
  };

  const handleEditCategory = (id: string) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Daftar Kategori</h1>
        <Link 
          to="/admin/categories/create" 
          className="flex items-center gap-2 md:px-4 px-2 md:py-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Link>
      </div>

      <div className="border rounded-lg bg-white shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Tanggal Dibuat</TableHead>
              <TableHead className="text-center w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{category.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500 truncate max-w-[400px]">
                    {category.description}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(category.createdAt).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => handleEditCategory(category.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                      title="Edit kategori"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-red-600 transition-colors"
                      title="Hapus kategori"
                    >
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
