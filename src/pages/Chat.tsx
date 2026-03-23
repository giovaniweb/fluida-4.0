import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Send, Loader2, MessageSquare, Bot, User, Trash2, Plus, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  'Como fazer um before/after impactante?',
  'Melhores práticas para divulgar botox',
  'Como fidelizar pacientes na estética',
  'Tendências de tratamentos faciais 2025',
  'Como precificar meus serviços?',
  'Estratégias para Instagram de clínica',
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const content = (text || input).trim()
    if (!content || streaming) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    const assistantId = crypto.randomUUID()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }])

    try {
      const { data: { session } } = await supabase.auth.getSession()
      abortRef.current = new AbortController()

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://lyifnttxpoypwibbffnv.supabase.co'}/functions/v1/fluichat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWZudHR4cG95cHdpYmJmZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDY3MTQsImV4cCI6MjA2NTkyMjcxNH0.4z8lmc2DAnykbh7YqquyoeEo0uJM_dKt2X90D7-OTS0',
          },
          body: JSON.stringify({ message: content, sessionId, stream: true }),
          signal: abortRef.current.signal,
        }
      )

      if (!response.ok) throw new Error('Erro na resposta')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const json = JSON.parse(data)
                const token = json.choices?.[0]?.delta?.content || ''
                accumulated += token
                setMessages(prev => prev.map(m =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                ))
              } catch {}
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return

      // Fallback local
      const fallbacks: Record<string, string> = {
        'before/after': 'Para um before/after impactante: use mesma luz e ângulo nos dois registros, mostre claramente a evolução, adicione data e nome do procedimento, e sempre peça autorização do paciente por escrito.',
        'botox': 'Para divulgar botox: foque nos resultados naturais, eduque sobre prevenção, mostre depoimentos reais (com autorização), e explique a diferença entre botox estético e preventivo.',
        'fidelizar': 'Para fidelizar pacientes: crie um programa de retorno com lembretes, envie conteúdo educativo personalizado, faça follow-up pós-procedimento, e ofereça vantagens para indicações.',
      }

      const key = Object.keys(fallbacks).find(k => content.toLowerCase().includes(k))
      const reply = key ? fallbacks[key] : `Como especialista em estética, posso te ajudar com "${content}". Esta funcionalidade estará disponível em breve com IA especializada. Por enquanto, explore os roteiros e diagnósticos!`

      // Simula streaming
      let i = 0
      const interval = setInterval(() => {
        i += 3
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: reply.slice(0, i) } : m
        ))
        if (i >= reply.length) clearInterval(interval)
      }, 20)
    }

    setStreaming(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([])
    if (streaming) abortRef.current?.abort()
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 fluida-gradient rounded-xl flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">FluiChat</h1>
            <p className="text-xs text-muted-foreground">IA especializada em estética</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Trash2 size={16} />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 fluida-gradient rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Como posso te ajudar?</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Sou especializado em marketing, conteúdo e estratégias para profissionais de estética.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-3 animate-slide-up', msg.role === 'user' && 'flex-row-reverse')}
          >
            <div className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
              msg.role === 'assistant' ? 'fluida-gradient' : 'bg-secondary border border-border'
            )}>
              {msg.role === 'assistant'
                ? <Bot size={16} className="text-white" />
                : <User size={16} className="text-muted-foreground" />
              }
            </div>
            <div className={cn(
              'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
              msg.role === 'assistant'
                ? 'bg-card border border-border text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}>
              {msg.content || (streaming && msg.role === 'assistant' && (
                <span className="flex gap-1 items-center text-muted-foreground">
                  <Loader2 size={12} className="animate-spin" /> Pensando...
                </span>
              ))}
              {msg.role === 'assistant' && streaming && msg === messages[messages.length - 1] && msg.content && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 bg-secondary border border-border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre marketing, conteúdo, procedimentos..."
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm max-h-32"
              style={{ height: 'auto' }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = Math.min(t.scrollHeight, 128) + 'px'
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            className="w-11 h-11 fluida-gradient text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
          >
            {streaming ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  )
}
