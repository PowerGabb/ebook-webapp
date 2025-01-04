import { Link, useLocation } from 'react-router-dom'
import {
  Users,
  Book,
  FolderTree,
  LayoutDashboard
} from 'lucide-react'

interface SidebarProps {
  onNavigate?: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Book', 
    href: '/admin/books',
    icon: Book
  },
  {
    title: 'Category',
    href: '/admin/categories',
    icon: FolderTree
  }
]

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full w-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                location.pathname === item.href ? 'bg-gray-100' : ''
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}