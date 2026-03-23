import { useAuth } from '@/contexts/AuthContext'
import { FileText, MessageSquare, Image, Zap, BookOpen, TrendingUp, Clock, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const quickActions = [
  { label: 'Novo Roteiro', icon: FileText, to: '/roteiros', color: 'from-blue-500 to-cyan-500', desc: 'Crie roteiros com IA em segundos' },
  { label: 'FluiChat', icon: MessageSquare, to: '/chat', color: 'from-violet-500 to-purple-500', desc: 'Converse com a IA especializada' },
  { label: 'Gerar Imagem', icon: Image, to: '/imagens', color: 'from-pink-500 to-rose-500', desc: 'Imagens únicas para seu conteúdo' },
  { label: 'Diagnóstico', icon: Zap, to: '/mkt', color: 'from-amber-500 to-orange-500', desc: 'Analise seu marketing' },
  { label: 'Academia', icon: BookOpen, to: '/academia', color: 'from-emerald-500 to-teal-500', desc: 'Aprenda com especialistas' },
]

const stats = [
  { label: 'Roteiros criados', value: '0', icon: FileText, trend: '+0 este mês' },
  { label: 'Imagens geradas', value: '0', icon: Image, trend: '+0 este mês' },
  { label: 'Horas de conteúdo', value: '0h', icon: Clock, trend: 'na Academia' },
  { label: 'Pontuação', value: '0 XP', icon: Star, trend: 'Level 1' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Profissional'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {name}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">O que vamos criar hoje?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp size={10} /> {trend}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map(({ label, icon: Icon, to, color, desc }) => (
            <Link
              key={to}
              to={to}
              className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <p className="font-semibold text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome card */}
      <div className="fluida-gradient rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Bem-vindo ao Fluida 4.0</h3>
        <p className="text-white/80 mb-4">
          A plataforma foi reconstruída do zero para ser 10x mais rápida, inteligente e poderosa. Explore as ferramentas e crie conteúdo incrível.
        </p>
        <Link to="/roteiros" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors">
          <FileText size={16} /> Criar primeiro roteiro
        </Link>
      </div>
    </div>
  )
}
