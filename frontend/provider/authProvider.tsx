import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<string>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan')
      }

      const { accessToken, user, refreshToken } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      
      return user.role
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
