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
      {/* Header */}
      <header className="bg-black border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg gradient-iridescent border border-gray-200">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wider uppercase">DEBT GUARD</h1>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Schutz vor Überschulden</p>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-100 text-white border border-gray-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm font-medium tracking-wide">{item.label}</span>
                  </Link>
                )
              })}
              <Link
                to="/setup"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-white transition-all duration-300 border border-transparent"
                title="Setup ändern"
              >
                <Edit className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium tracking-wide">Setup</span>
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

