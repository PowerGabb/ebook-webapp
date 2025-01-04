import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateUser, getUserById } from '../services/users/apiUser'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
}

export default function EditUsers() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profile: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: ''
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) return;
        const response = await getUserById(id);
        if (response.status) {
          const { email, role, profile } = response.data;
          setFormData({
            email,
            password: '',
            confirmPassword: '',
            role,
            profile: {
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              phoneNumber: profile.phone || '',
              address: profile.address || ''
            }
          });
        } else {
          toast.error('Gagal memuat data pengguna');
          navigate('/admin/users');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Terjadi kesalahan saat memuat data pengguna');
        navigate('/admin/users');
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserForm] as Record<string, string>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);

    try {
      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Format email tidak valid');
        return;
      }

      // Validasi password jika diisi
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Password dan konfirmasi password tidak cocok');
          return;
        }
      }

      // Hapus confirmPassword dan password kosong dari data yang akan dikirim
      const { confirmPassword, ...userData } = formData;
      const userDataToSend = {
        ...userData,
        password: userData.password || undefined
      };

      const response = await updateUser(id, userDataToSend);
      if (response.status) {
        toast.success('Pengguna berhasil diperbarui');
        navigate('/admin/users');
      } else {
        toast.error(response.message || 'Gagal memperbarui pengguna');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memperbarui pengguna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Pengguna</h1>

      <div className="max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  required
                  className="border-gray-300"
                />
              </div>

              {/* Password */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru (Opsional)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password baru"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Konfirmasi password baru"
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nama */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile.firstName">Nama Depan</Label>
                  <Input
                    id="profile.firstName"
                    name="profile.firstName"
                    value={formData.profile.firstName}
                    onChange={handleChange}
                    placeholder="Masukkan nama depan"
                    required
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.lastName">Nama Belakang</Label>
                  <Input
                    id="profile.lastName"
                    name="profile.lastName"
                    value={formData.profile.lastName}
                    onChange={handleChange}
                    placeholder="Masukkan nama belakang"
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <Label htmlFor="profile.phoneNumber">Nomor Telepon</Label>
                <Input
                  id="profile.phoneNumber"
                  name="profile.phoneNumber"
                  value={formData.profile.phoneNumber}
                  onChange={handleChange}
                  placeholder="Masukkan nomor telepon"
                  className="border-gray-300"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <Label htmlFor="profile.address">Alamat</Label>
                <Textarea
                  id="profile.address"
                  name="profile.address"
                  value={formData.profile.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat"
                  className="min-h-[100px] border-gray-300"
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
                  onClick={() => navigate('/admin/users')}
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
