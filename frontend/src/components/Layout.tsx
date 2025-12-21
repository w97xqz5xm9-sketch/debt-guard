import { Link, useLocation } from 'react-router-dom'
import { Home, Wallet, Settings, Shield, Edit, Info } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/budget', icon: Wallet, label: 'Budget' },
    { path: '/explanation', icon: Info, label: 'Erklärung' },
    { path: '/settings', icon: Settings, label: 'Einstellungen' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header - Apple-inspired */}
      <header className="bg-black/80 border-b border-gray-300 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl gradient-iridescent">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white tracking-tight">Debt Guard</h1>
                <p className="text-xs text-gray-500 label-text">Schutz vor Überschulden</p>
              </div>
            </div>
            <nav className="flex space-x-1 items-center">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-200 text-white'
                        : 'text-gray-500 hover:bg-gray-200 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium tracking-tight">{item.label}</span>
                  </Link>
                )
              })}
              <Link
                to="/setup"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-200 hover:text-white transition-all duration-200"
                title="Setup ändern"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium tracking-tight">Setup</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

