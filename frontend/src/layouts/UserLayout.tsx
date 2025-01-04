import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Heart, BookOpen, Menu, X, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: Search, label: 'Cari Buku', path: '/search' },
    { icon: Heart, label: 'Favorit', path: '/favorites' },
    { icon: BookOpen, label: 'Buku Terbaru', path: '/latest' },
    { icon: User, label: "Akun", path: '/account'}
  ]

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">ReadBooks</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActivePath(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium border-b border-gray-200",
                  isActivePath(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-6">
        {children}
      </main>
    </div>
  )
}
