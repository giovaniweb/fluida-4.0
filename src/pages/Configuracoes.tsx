import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  Settings, User, Bell, Shield, Palette, CreditCard,
  Moon, Sun, Monitor, Check, Camera, Save, Loader2, LogOut
} from 'lucide-react'
import { toast } from 'sonner'

type Tab = 'perfil' | 'aparencia' | 'notificacoes' | 'privacidade' | 'plano'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'privacidade', label: 'Privacidade', icon: Shield },
  { id: 'plano', label: 'Plano', icon: CreditCard },
]

export default function Configuracoes() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const [saving, setSaving] = useState(false)

  // Profile form state
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [clinic, setClinic] = useState(user?.user_metadata?.clinic || '')
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '')
  const [bio, setBio] = useState('')

  // Notification state
  const [notifs, setNotifs] = useState({
    email_marketing: true,
    email_updates: true,
    email_tips: false,
    push_chat: true,
    push_scripts: true,
    push_weekly: false,
  })

  async function saveProfile() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Perfil atualizado com sucesso!')
  }

  const email = user?.email || ''
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : email.slice(0, 2).toUpperCase()

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
            <div className="pt-1 border-t border-border mt-1">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all"
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Perfil */}
          {activeTab === 'perfil' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="font-bold text-foreground">Informações do Perfil</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl fluida-gradient flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                    <Camera size={13} className="text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-foreground">{name || 'Seu nome'}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <button className="text-xs text-primary hover:underline mt-1">Alterar foto</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                  <input
                    value={email}
                    disabled
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Clínica / Empresa</label>
                  <input
                    value={clinic}
                    onChange={e => setClinic(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    placeholder="Nome da clínica"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Telefone / WhatsApp</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Bio / Especialidade</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                  placeholder="Ex: Especialista em estética avançada, com foco em tratamentos faciais..."
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 fluida-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          )}

          {/* Aparência */}
          {activeTab === 'aparencia' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="font-bold text-foreground">Aparência</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Tema</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Claro', icon: Sun },
                    { value: 'dark', label: 'Escuro', icon: Moon },
                    { value: 'system', label: 'Sistema', icon: Monitor },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all',
                        theme === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <opt.icon size={24} className={theme === opt.value ? 'text-primary' : 'text-muted-foreground'} />
                      <span className={cn('text-sm font-medium', theme === opt.value ? 'text-primary' : 'text-muted-foreground')}>
                        {opt.label}
                      </span>
                      {theme === opt.value && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Cor de destaque</label>
                <div className="flex items-center gap-3">
                  {['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Personalização de cores disponível em breve</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Fonte</label>
                <div className="flex gap-3">
                  {['Inter (padrão)', 'Nunito', 'Poppins'].map(font => (
                    <button
                      key={font}
                      className={cn(
                        'px-4 py-2 rounded-xl border text-sm transition-all',
                        font === 'Inter (padrão)'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notificacoes' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="font-bold text-foreground">Notificações</h2>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">E-mail</h3>
                {[
                  { key: 'email_marketing', label: 'Dicas de marketing', desc: 'Conteúdo semanal sobre estratégias' },
                  { key: 'email_updates', label: 'Atualizações da plataforma', desc: 'Novas funcionalidades e melhorias' },
                  { key: 'email_tips', label: 'Newsletter mensal', desc: 'Resumo mensal de tendências' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifs] }))}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors relative',
                        notifs[item.key as keyof typeof notifs] ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full bg-white absolute top-1 transition-all',
                        notifs[item.key as keyof typeof notifs] ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </div>
                ))}

                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-2">Push</h3>
                {[
                  { key: 'push_chat', label: 'Respostas do FluiChat', desc: 'Quando a IA responder sua pergunta' },
                  { key: 'push_scripts', label: 'Roteiros gerados', desc: 'Quando seu roteiro estiver pronto' },
                  { key: 'push_weekly', label: 'Relatório semanal', desc: 'Seu resumo de atividades' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifs] }))}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors relative',
                        notifs[item.key as keyof typeof notifs] ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full bg-white absolute top-1 transition-all',
                        notifs[item.key as keyof typeof notifs] ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => toast.success('Preferências de notificação salvas!')}
                className="flex items-center gap-2 px-6 py-3 fluida-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                <Save size={16} /> Salvar preferências
              </button>
            </div>
          )}

          {/* Privacidade */}
          {activeTab === 'privacidade' && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h2 className="font-bold text-foreground">Privacidade e Segurança</h2>

              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-xl space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Alterar senha</h3>
                  <input type="password" placeholder="Senha atual" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                  <input type="password" placeholder="Nova senha" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                  <input type="password" placeholder="Confirmar nova senha" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                  <button
                    onClick={() => toast.success('Senha alterada!')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Atualizar senha
                  </button>
                </div>

                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Autenticação de dois fatores</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Adicione segurança extra à sua conta</p>
                    </div>
                    <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
                      Ativar
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Sessões ativas</p>
                      <p className="text-xs text-muted-foreground mt-0.5">1 dispositivo ativo agora</p>
                    </div>
                    <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:border-rose-500/40 hover:text-rose-500 transition-colors">
                      Encerrar todas
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1">Zona de perigo</p>
                  <p className="text-xs text-muted-foreground mb-3">Excluir sua conta é uma ação irreversível. Todos os seus dados serão apagados permanentemente.</p>
                  <button className="px-4 py-2 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-medium hover:bg-rose-500/10 transition-colors">
                    Excluir minha conta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Plano */}
          {activeTab === 'plano' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-foreground mb-4">Seu Plano Atual</h2>
                <div className="flex items-center gap-4 p-4 fluida-gradient rounded-xl text-white mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Plano Pro</p>
                    <p className="text-sm opacity-80">Renovação em 15 dias</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-2xl">R$97</p>
                    <p className="text-xs opacity-70">/mês</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    'Roteiros ilimitados com IA',
                    'FluiChat especializado',
                    'Geração de imagens (100/mês)',
                    'FluiMKT — Diagnóstico completo',
                    'Academia Fluida — Acesso total',
                    'Suporte prioritário',
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Histórico de pagamentos</h3>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 2025', value: 'R$ 97,00', status: 'Pago' },
                    { date: 'Dez 2024', value: 'R$ 97,00', status: 'Pago' },
                    { date: 'Nov 2024', value: 'R$ 97,00', status: 'Pago' },
                  ].map(payment => (
                    <div key={payment.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{payment.date}</span>
                      <span className="text-sm font-medium text-foreground">{payment.value}</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">{payment.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
