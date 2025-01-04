import { useAuth } from '../../../provider/authProvider'

interface HeaderProps {
  children: React.ReactNode
}

export default function Header({ children }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="h-14 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          Welcome, {user?.firstName} {user?.lastName}
        </span>
      </div>
      {children}
    </header>
  )
} 