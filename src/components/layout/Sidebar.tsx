import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, MessageSquare, Image, BookOpen,
  FolderOpen, BarChart3, Trophy, ShoppingBag, Zap, Settings,
  LogOut, ChevronLeft, ChevronRight, Stethoscope
} from 'lucide-react'
import { useState } from 'react'

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Roteiros', icon: FileText, to: '/roteiros' },
  { label: 'FluiChat', icon: MessageSquare, to: '/chat' },
  { label: 'Imagens', icon: Image, to: '/imagens' },
  { label: 'FluiMKT', icon: Zap, to: '/mkt' },
  { label: 'Academia', icon: BookOpen, to: '/academia' },
  { label: 'Assets', icon: FolderOpen, to: '/assets' },
  { label: 'Marketplace', icon: ShoppingBag, to: '/marketplace' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Conquistas', icon: Trophy, to: '/conquistas' },
]

export function Sidebar() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-card border-r border-border transition-all duration-300 relative',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 fluida-gradient rounded-lg flex items-center justify-center flex-shrink-0">
          <Stethoscope size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-xl fluida-gradient-text">Fluida</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-4',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Settings size={18} className="flex-shrink-0" />
            {!collapsed && <span>Admin</span>}
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border space-y-1">
        <NavLink
          to="/configuracoes"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
        <button
          onClick={async () => { await signOut(); navigate('/auth') }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
