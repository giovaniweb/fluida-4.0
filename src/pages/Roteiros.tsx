import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Loader2, FileText, Download, RefreshCw, Sparkles, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const FORMATS = [
  { id: 'reels', label: 'Reels / TikTok', duration: '30-60s' },
  { id: 'stories', label: 'Stories', duration: '15s' },
  { id: 'carrossel', label: 'Carrossel', duration: '5-10 slides' },
  { id: 'youtube', label: 'YouTube', duration: '5-15min' },
  { id: 'linkedin', label: 'LinkedIn', duration: 'Post' },
  { id: 'whatsapp', label: 'WhatsApp', duration: 'Mensagem' },
  { id: 'email', label: 'E-mail', duration: 'Newsletter' },
  { id: 'blog', label: 'Blog', duration: 'Artigo' },
]

const TONES = ['Profissional', 'Educativo', 'Inspirador', 'Descontraído', 'Urgente', 'Empático']
const GOALS = ['Atrair clientes', 'Educar pacientes', 'Mostrar resultados', 'Promover serviço', 'Construir autoridade', 'Engajamento']

export default function Roteiros() {
  const { user } = useAuth()
  const [tema, setTema] = useState('')
  const [formato, setFormato] = useState('reels')
  const [tom, setTom] = useState('Profissional')
  const [objetivo, setObjetivo] = useState('Atrair clientes')
  const [publico, setPublico] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [copied, setCopied] = useState(false)
  const scriptRef = useRef('')

  async function generateScript() {
    if (!tema.trim()) return
    setLoading(true)
    setScript('')
    scriptRef.current = ''
    setStreaming(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://lyifnttxpoypwibbffnv.supabase.co'}/functions/v1/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWZudHR4cG95cHdpYmJmZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDY3MTQsImV4cCI6MjA2NTkyMjcxNH0.4z8lmc2DAnykbh7YqquyoeEo0uJM_dKt2X90D7-OTS0',
        },
        body: JSON.stringify({ tema, formato, tom, objetivo, publico, stream: true }),
      })

      if (!response.ok) throw new Error('Erro ao gerar roteiro')

      // Streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const json = JSON.parse(data)
                const token = json.choices?.[0]?.delta?.content || ''
                scriptRef.current += token
                setScript(scriptRef.current)
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      // Fallback: gera localmente com template
      const fmt = FORMATS.find(f => f.id === formato)
      const template = `# Roteiro: ${tema}
**Formato:** ${fmt?.label} (${fmt?.duration})
**Tom:** ${tom} | **Objetivo:** ${objetivo}
${publico ? `**Público:** ${publico}` : ''}

---

## 🎬 ABERTURA (Hook - primeiros 3 segundos)
"Você sabia que [fato surpreendente sobre ${tema}]?"

## 📌 DESENVOLVIMENTO

### Bloco 1 — Contexto
[Explique brevemente o problema ou contexto relacionado a ${tema}]

### Bloco 2 — Solução
[Apresente sua abordagem/serviço como solução]

### Bloco 3 — Prova Social
[Mencione resultados ou depoimentos de pacientes]

## 🎯 CTA (Chamada para ação)
"${objetivo === 'Atrair clientes' ? 'Agende sua consulta — link na bio!' : 'Salve esse conteúdo e compartilhe!'}"

---
*Roteiro gerado pelo Fluida 4.0*`

      // Simula streaming
      for (let i = 0; i < template.length; i += 3) {
        await new Promise(r => setTimeout(r, 15))
        scriptRef.current = template.slice(0, i + 3)
        setScript(scriptRef.current)
      }
      scriptRef.current = template
      setScript(template)
    }

    setLoading(false)
    setStreaming(false)
  }

  async function copyScript() {
    await navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="text-primary" size={24} />
          Roteiros com IA
        </h1>
        <p className="text-muted-foreground mt-1">Crie roteiros profissionais para qualquer formato em segundos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tema do conteúdo *</label>
              <input
                value={tema}
                onChange={e => setTema(e.target.value)}
                placeholder="Ex: Benefícios do botox preventivo, Cuidados pós-procedimento..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Formato</label>
              <div className="grid grid-cols-2 gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormato(f.id)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-all',
                      formato === f.id
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    <span>{f.label}</span>
                    <span className="text-xs opacity-60">{f.duration}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tom */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tom de voz</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTom(t)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-sm transition-all',
                      tom === t
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Objetivo</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button
                    key={g}
                    onClick={() => setObjetivo(g)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-sm transition-all',
                      objetivo === g
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Público */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Público-alvo (opcional)</label>
              <input
                value={publico}
                onChange={e => setPublico(e.target.value)}
                placeholder="Ex: Mulheres 30-50 anos interessadas em rejuvenescimento"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <button
              onClick={generateScript}
              disabled={loading || !tema.trim()}
              className="w-full py-3.5 fluida-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Gerando roteiro...</>
              ) : (
                <><Sparkles size={18} /> Gerar Roteiro</>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Roteiro gerado</h3>
            {script && (
              <div className="flex gap-2">
                <button onClick={copyScript} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button onClick={generateScript} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw size={14} /> Regenerar
                </button>
              </div>
            )}
          </div>

          {!script && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
              <FileText size={48} className="mb-3 opacity-20" />
              <p className="font-medium">Seu roteiro aparecerá aqui</p>
              <p className="text-sm mt-1 opacity-70">Preencha o formulário e clique em Gerar</p>
            </div>
          )}

          {(script || loading) && (
            <div className="flex-1 overflow-y-auto">
              <div className={cn(
                'prose prose-sm dark:prose-invert max-w-none text-foreground',
                streaming && 'streaming-cursor'
              )}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{script}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
