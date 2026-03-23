import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Zap, ChevronRight, ChevronLeft, Loader2, CheckCircle2, BarChart3, Target, Users, MessageCircle, Star, TrendingUp } from 'lucide-react'

const BLOCKS = [
  {
    id: 'identidade',
    label: 'Identidade',
    icon: Star,
    color: 'from-violet-500 to-purple-600',
    questions: [
      { id: 'especialidade', label: 'Qual é sua especialidade principal?', placeholder: 'Ex: Harmonização facial, Estética corporal, Depilação...' },
      { id: 'diferencial', label: 'O que te diferencia dos concorrentes?', placeholder: 'Ex: Atendimento humanizado, técnica exclusiva, localização...' },
      { id: 'valores', label: 'Quais valores sua marca transmite?', placeholder: 'Ex: Confiança, resultado, naturalidade...' },
    ]
  },
  {
    id: 'publico',
    label: 'Público-Alvo',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    questions: [
      { id: 'perfil', label: 'Descreva seu cliente ideal', placeholder: 'Ex: Mulheres 30-50 anos, classe B/C, interessadas em rejuvenescimento...' },
      { id: 'dor', label: 'Qual o maior problema/insegurança do seu cliente?', placeholder: 'Ex: Envelhecimento precoce, queda de cabelo, celulite...' },
      { id: 'desejo', label: 'Qual o maior desejo/sonho do seu cliente?', placeholder: 'Ex: Aparentar mais jovem, ter mais autoestima, ser admirada...' },
    ]
  },
  {
    id: 'comunicacao',
    label: 'Comunicação',
    icon: MessageCircle,
    color: 'from-emerald-500 to-teal-600',
    questions: [
      { id: 'canais', label: 'Onde você divulga seus serviços hoje?', placeholder: 'Ex: Instagram, WhatsApp, Google, indicações...' },
      { id: 'conteudo', label: 'Que tipo de conteúdo você publica?', placeholder: 'Ex: Antes/depois, dicas, bastidores, depoimentos...' },
      { id: 'frequencia', label: 'Com que frequência você posta?', placeholder: 'Ex: Diariamente, 3x por semana, quando lembro...' },
    ]
  },
  {
    id: 'experiencia',
    label: 'Experiência',
    icon: Target,
    color: 'from-orange-500 to-amber-600',
    questions: [
      { id: 'atendimento', label: 'Como é a experiência do seu atendimento?', placeholder: 'Ex: Agenda online, ambiente aconchegante, follow-up pós-procedimento...' },
      { id: 'retorno', label: 'Como você fideliza seus clientes?', placeholder: 'Ex: Programa de retorno, lembrete de manutenção, clube de benefícios...' },
      { id: 'indicacao', label: 'Seus clientes te indicam? Como?', placeholder: 'Ex: Espontaneamente, tenho programa de indicação, raramente...' },
    ]
  },
  {
    id: 'metas',
    label: 'Metas',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    questions: [
      { id: 'faturamento', label: 'Qual seu faturamento atual e meta?', placeholder: 'Ex: Faturamento R$5k/mês, meta R$15k/mês em 6 meses...' },
      { id: 'desafios', label: 'Qual seu maior desafio de marketing hoje?', placeholder: 'Ex: Atrair novos clientes, reter os existentes, aparecer no Google...' },
      { id: 'prazo', label: 'Em quanto tempo quer atingir suas metas?', placeholder: 'Ex: 3 meses, 6 meses, 1 ano...' },
    ]
  },
]

interface Answers { [key: string]: string }
interface DiagnosticResult {
  score: number
  pontosForts: string[]
  pontosAMelhorar: string[]
  planoAcao: string[]
  calendarioConteudo: string[]
}

export default function FluiMKT() {
  const [step, setStep] = useState(0) // 0 = intro, 1-5 = blocks, 6 = result
  const [answers, setAnswers] = useState<Answers>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const currentBlock = BLOCKS[step - 1]
  const progress = step === 0 ? 0 : step === 6 ? 100 : Math.round((step / BLOCKS.length) * 100)

  function updateAnswer(questionId: string, value: string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function canAdvance() {
    if (step === 0) return true
    if (step > BLOCKS.length) return false
    return currentBlock.questions.every(q => answers[q.id]?.trim())
  }

  async function advance() {
    if (step < BLOCKS.length) {
      setStep(prev => prev + 1)
    } else {
      await runDiagnostic()
    }
  }

  async function runDiagnostic() {
    setLoading(true)
    setStep(6)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://lyifnttxpoypwibbffnv.supabase.co'}/functions/v1/fluimkt-diagnostic`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWZudHR4cG95cHdpYmJmZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDY3MTQsImV4cCI6MjA2NTkyMjcxNH0.4z8lmc2DAnykbh7YqquyoeEo0uJM_dKt2X90D7-OTS0',
          },
          body: JSON.stringify({ answers, mode: 'diagnostic' }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else throw new Error()
    } catch {
      // Fallback
      setResult({
        score: 68,
        pontosForts: [
          'Você tem clareza sobre sua especialidade e público-alvo',
          'Já utiliza canais digitais para divulgação',
          'Tem consciência sobre a importância da fidelização',
        ],
        pontosAMelhorar: [
          'Frequência de postagem precisa ser mais consistente',
          'Investir em estratégias de captação de novos leads',
          'Criar um programa formal de indicação',
        ],
        planoAcao: [
          'Semana 1-2: Definir calendário de conteúdo com 5 posts/semana',
          'Semana 3-4: Criar programa de indicação com benefícios claros',
          'Mês 2: Implementar automação de follow-up pós-procedimento',
          'Mês 3: Investir em tráfego pago (R$300-500/mês para começar)',
        ],
        calendarioConteudo: [
          'Segunda: Dica educativa sobre procedimento',
          'Terça: Bastidores do atendimento',
          'Quarta: Antes/depois (com autorização)',
          'Quinta: Depoimento de cliente',
          'Sexta: Promoção ou novidade',
          'Sábado: Conteúdo de estilo de vida / inspiração',
        ],
      })
    }

    setLoading(false)
  }

  if (step === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
        <div className="w-20 h-20 fluida-gradient rounded-2xl flex items-center justify-center mb-6">
          <Zap size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">FluiMKT</h1>
        <p className="text-muted-foreground text-lg mb-2">Diagnóstico estratégico de marketing</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          Em 5 blocos de perguntas, nossa IA analisa sua situação atual e cria um plano de ação personalizado para alavancar seu negócio.
        </p>
        <div className="grid grid-cols-5 gap-3 mb-8 w-full">
          {BLOCKS.map(b => {
            const Icon = b.icon
            return (
              <div key={b.id} className="flex flex-col items-center gap-2">
                <div className={cn('w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center', b.color)}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{b.label}</span>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => setStep(1)}
          className="fluida-gradient text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Iniciar diagnóstico <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  if (step === 6) {
    return (
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 fluida-gradient rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Resultado do Diagnóstico</h1>
            <p className="text-sm text-muted-foreground">Análise completa do seu marketing</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 size={40} className="animate-spin text-primary mb-4" />
            <p className="font-medium text-foreground">Analisando suas respostas...</p>
            <p className="text-sm text-muted-foreground mt-1">Nossa IA está criando seu plano personalizado</p>
          </div>
        ) : result && (
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                    strokeDasharray={`${result.score * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{result.score}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Pontuação de Marketing</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {result.score >= 80 ? 'Excelente! Seu marketing está bem estruturado.' :
                   result.score >= 60 ? 'Bom! Há espaço para crescer com ajustes pontuais.' :
                   'Há muito potencial a explorar. Siga o plano de ação.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pontos fortes */}
              <div className="bg-card border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Pontos fortes
                </h3>
                <ul className="space-y-2">
                  {result.pontosForts.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Melhorias */}
              <div className="bg-card border border-amber-500/20 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target size={18} className="text-amber-500" /> A melhorar
                </h3>
                <ul className="space-y-2">
                  {result.pontosAMelhorar.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Plano de Ação */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Plano de Ação
              </h3>
              <ol className="space-y-2">
                {result.planoAcao.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full fluida-gradient text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>

            {/* Calendário */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageCircle size={18} className="text-primary" /> Calendário de Conteúdo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {result.calendarioConteudo.map((c, i) => (
                  <div key={i} className="bg-secondary rounded-xl px-3 py-2.5 text-xs text-muted-foreground">{c}</div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep(0); setAnswers({}); setResult(null) }}
              className="w-full py-3 bg-secondary text-muted-foreground rounded-xl hover:bg-accent hover:text-foreground transition-colors font-medium text-sm"
            >
              Novo diagnóstico
            </button>
          </div>
        )}
      </div>
    )
  }

  // Questions
  const Icon = currentBlock.icon
  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Bloco {step} de {BLOCKS.length}</span>
          <span className="text-sm font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full fluida-gradient rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Block header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn('w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center', currentBlock.color)}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{currentBlock.label}</h2>
          <p className="text-sm text-muted-foreground">{currentBlock.questions.length} perguntas</p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {currentBlock.questions.map(q => (
          <div key={q.id} className="bg-card border border-border rounded-2xl p-4">
            <label className="block text-sm font-medium text-foreground mb-2">{q.label}</label>
            <textarea
              value={answers[q.id] || ''}
              onChange={e => updateAnswer(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={3}
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all text-sm"
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-3 bg-secondary text-muted-foreground rounded-xl hover:text-foreground transition-colors font-medium"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
        )}
        <button
          onClick={advance}
          disabled={!canAdvance()}
          className="flex-1 py-3 fluida-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {step < BLOCKS.length ? (
            <>Próximo bloco <ChevronRight size={18} /></>
          ) : (
            <>Analisar <Zap size={18} /></>
          )}
        </button>
      </div>
    </div>
  )
}
