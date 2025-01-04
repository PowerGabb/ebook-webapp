import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createCategory, getAllCategories } from '../services/categories/apiCategory'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface CategoryForm {
  name: string;
  description: string;
}

export default function CreateCategories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: ''
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createCategory(formData);
      if (response.status) {
        toast.success(response.message || 'Kategori berhasil ditambahkan');
        // Refresh categories list after adding new category
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.status) {
          setCategories(categoriesResponse.data);
        }
        // Reset form
        setFormData({
          name: '',
          description: ''
        });
      } else {
        toast.error(response.message || 'Gagal menambahkan kategori');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat menambahkan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Kategori</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama kategori"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi kategori"
                  
                  className="min-h-[120px] border-gray-300"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Categories List Card */}
        <Card>
          <CardContent className="p-6">
            <div className="font-medium text-lg mb-4">Daftar Kategori</div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <div className="text-gray-500 truncate max-w-[200px]">
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                            title="Edit kategori"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
