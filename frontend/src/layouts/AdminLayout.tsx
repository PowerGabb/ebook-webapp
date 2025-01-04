import { useState } from 'react'
import { useAuth } from '../../provider/authProvider'
import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden">
          <div className="fixed left-0 top-0 h-full w-[240px] bg-white">
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex h-screen fixed w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="sm:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg sm:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </Header>

        {/* Page Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
