import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserCircle, Pencil, Trash2, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteUser, getAllUsers } from '../services/users/apiUser'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  userId: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  profile: Profile | null;
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.status) {
          setUsers(response.data);
        } else {
          toast.error("Gagal memuat data pengguna");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Terjadi kesalahan saat memuat data pengguna");
      }
    };
    fetchUsers();
  }, []);

  

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        const response = await deleteUser(id);
        if (response.status) {
          setUsers(users.filter((user) => user.id !== id));
          toast.success("Pengguna berhasil dihapus");
        } else {
          toast.error("Gagal menghapus pengguna");
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error("Terjadi kesalahan saat menghapus pengguna");
      }
    }
  }

  const handleEditUser = (id: string) => {
    navigate(`/admin/users/edit/${id}`);
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const getFullName = (profile: Profile | null) => {
    if (!profile) return '-';
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || '-';
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
        <Link to="/admin/users/create" className="flex items-center gap-2 md:px-4 px-2 md:py-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </Link>
      </div>

      <div className="border rounded-lg bg-white shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-gray-400" />
                    <span>{getFullName(user.profile)}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.profile?.phone || '-'}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {user.profile?.address || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {user.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => handleEditUser(user.id)} 
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                      title="Edit pengguna"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                      title="Hapus pengguna"
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
