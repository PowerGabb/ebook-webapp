import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateCategory, getCategoryById } from '../services/categories/apiCategory'
import { toast } from 'sonner'
import { useParams, useNavigate } from 'react-router-dom'

interface CategoryForm {
  name: string;
  description: string;
}

export default function EditCategories() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (!id) return;
        const response = await getCategoryById(id);
        if (response.status) {
          const { name, description } = response.data;
          setFormData({
            name: name || '',
            description: description || ''
          });
        } else {
          toast.error('Gagal memuat data kategori');
          navigate('/admin/categories');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Terjadi kesalahan saat memuat data kategori');
        navigate('/admin/categories');
      }
    };
    fetchCategory();
  }, [id, navigate]);

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
    if (!id) return;
    
    setLoading(true);

    try {
      const response = await updateCategory(id, formData);
      if (response.status) {
        toast.success(response.message || 'Kategori berhasil diperbarui');
        navigate('/admin/categories');
      } else {
        toast.error(response.message || 'Gagal memperbarui kategori');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memperbarui kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Kategori</h1>

      <div className="max-w-2xl">
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
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/categories')}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
