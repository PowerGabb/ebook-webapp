import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../provider/authProvider'
import { Toaster } from 'sonner'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'
import AuthRoutes from './routes/AuthRoutes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/*" element={
            <AuthLayout>
              <AuthRoutes />
            </AuthLayout>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminRoutes />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="/*" element={
            <UserLayout>
              <UserRoutes />
            </UserLayout>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AuthProvider>
  )
}

export default App