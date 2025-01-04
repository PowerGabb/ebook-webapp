import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
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
  )
}

export default App 