import { Navigate } from 'react-router-dom'
import { useAuth } from '../../provider/authProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
} 