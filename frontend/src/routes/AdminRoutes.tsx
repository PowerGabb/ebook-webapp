import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/admin/Dashboard'
import ListBooks from '@/pages/admin/books/ListBooks'
import CreateBooks from '@/pages/admin/books/CreateBooks'
import ListCategories from '@/pages/admin/categories/ListCategories'
import CreateCategories from '@/pages/admin/categories/CreateCategories'
import EditBooks from '@/pages/admin/books/EditBooks'
import EditCategories from '@/pages/admin/categories/EditCategories'
import ListUsers from '@/pages/admin/users/ListUsers'
import CreateUsers from '@/pages/admin/users/CreateUsers'
import EditUsers from '@/pages/admin/users/EditUsers'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/users" element={<ListUsers />} />
      <Route path="/users/create" element={<CreateUsers />} />
      <Route path="/users/edit/:id" element={<EditUsers />} />

      <Route path="/books" element={<ListBooks />} />
      <Route path="/books/create" element={<CreateBooks />} />
      <Route path="/books/edit/:id" element={<EditBooks />} />

      
      <Route path="/categories" element={<ListCategories />} />
      <Route path="/categories/create" element={<CreateCategories />} />
      <Route path="/categories/edit/:id" element={<EditCategories />} />
    </Routes>
  )
}