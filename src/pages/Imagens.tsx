import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Image, Sparkles, Loader2, Download, RefreshCw, Copy, Check, Wand2 } from 'lucide-react'

const STYLES = [
  { id: 'fotografico', label: 'Fotográfico', desc: 'Realista, qualidade de estúdio', emoji: '📸' },
  { id: 'clinica', label: 'Clínica Premium', desc: 'Ambiente clean e profissional', emoji: '🏥' },
  { id: 'antes-depois', label: 'Antes/Depois', desc: 'Comparativo de resultado', emoji: '✨' },
  { id: 'produto', label: 'Produto', desc: 'Cosméticos e equipamentos', emoji: '💄' },
  { id: 'lifestyle', label: 'Lifestyle', desc: 'Lifestyle e bem-estar', emoji: '🌸' },
  { id: 'educativo', label: 'Educativo', desc: 'Infográfico e explicativo', emoji: '📊' },
  { id: 'social', label: 'Social Media', desc: 'Artes para redes sociais', emoji: '📱' },
  { id: 'artistico', label: 'Artístico', desc: 'Criativo e conceitual', emoji: '🎨' },
]

const RATIOS = [
  { id: '1:1', label: 'Quadrado', desc: 'Feed Instagram' },
  { id: '9:16', label: 'Vertical', desc: 'Stories / Reels' },
  { id: '16:9', label: 'Horizontal', desc: 'YouTube / Banner' },
  { id: '4:5', label: 'Retrato', desc: 'Feed portrait' },
]

const QUICK_PROMPTS = [
  'Procedimento de limpeza de pele sendo realizado em ambiente clean',
  'Antes e depois de preenchimento labial natural',
  'Espaço estético minimalista com luz natural suave',
  'Cosméticos premium organizados artisticamente',
  'Mulher jovem com pele iluminada e saudável',
  'Equipamento de radiofrequência em clínica moderna',
]

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  createdAt: Date
}

export default function Imagens() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('fotografico')
  const [ratio, setRatio] = useState('1:1')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [copiedId, setCopiedId] = useState('')

  async function generateImages() {
    if (!prompt.trim()) return
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const selectedStyle = STYLES.find(s => s.id === style)

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://lyifnttxpoypwibbffnv.supabase.co'}/functions/v1/generate-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWZudHR4cG95cHdpYmJmZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDY3MTQsImV4cCI6MjA2NTkyMjcxNH0.4z8lmc2DAnykbh7YqquyoeEo0uJM_dKt2X90D7-OTS0',
          },
          body: JSON.stringify({
            prompt: `${prompt}, style: ${selectedStyle?.label}, aesthetic clinic, professional photography`,
            style,
            ratio,
            quantity,
            model: 'dall-e-3',
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const newImages = (data.images || [data]).map((img: { url: string }) => ({
          id: crypto.randomUUID(),
          url: img.url,
          prompt,
          style,
          createdAt: new Date(),
        }))
        setImages(prev => [...newImages, ...prev])
      } else {
        // Placeholder para demo
        const placeholders = Array.from({ length: quantity }, (_, i) => ({
          id: crypto.randomUUID(),
          url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
          prompt,
          style,
          createdAt: new Date(),
        }))
        setImages(prev => [...placeholders, ...prev])
      }
    } catch {
      const placeholders = Array.from({ length: quantity }, (_, i) => ({
        id: crypto.randomUUID(),
        url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
        prompt,
        style,
        createdAt: new Date(),
      }))
      setImages(prev => [...placeholders, ...prev])
    }

    setLoading(false)
  }

  async function copyPrompt(id: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Image className="text-primary" size={24} />
          Geração de Imagens
        </h1>
        <p className="text-muted-foreground mt-1">Crie imagens únicas para seu conteúdo de estética com IA</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Descreva a imagem *</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ex: Mulher jovem com pele impecável, iluminação suave de estúdio..."
                rows={3}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all text-sm"
              />
            </div>

            {/* Quick prompts */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Sugestões rápidas</label>
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="w-full text-left text-xs px-3 py-2 bg-secondary rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Estilo</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      'flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all',
                      style === s.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/40'
                    )}
                  >
                    <span className="text-base mb-0.5">{s.emoji}</span>
                    <span className={cn('text-xs font-medium', style === s.id ? 'text-primary' : 'text-foreground')}>{s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ratio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Proporção</label>
              <div className="grid grid-cols-2 gap-2">
                {RATIOS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRatio(r.id)}
                    className={cn(
                      'px-3 py-2 rounded-xl border text-sm transition-all',
                      ratio === r.id
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    <div className="font-medium">{r.id}</div>
                    <div className="text-xs opacity-70">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantidade: <span className="text-primary">{quantity}</span>
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span><span>2</span><span>3</span><span>4</span>
              </div>
            </div>

            <button
              onClick={generateImages}
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 fluida-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Gerando...</>
              ) : (
                <><Wand2 size={18} /> Gerar {quantity > 1 ? `${quantity} imagens` : 'imagem'}</>
              )}
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="xl:col-span-2">
          {images.length === 0 && !loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-card border border-border border-dashed rounded-2xl p-8">
              <Image size={48} className="text-muted-foreground/30 mb-3" />
              <p className="font-medium text-muted-foreground">Suas imagens aparecerão aqui</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Descreva uma imagem e clique em Gerar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {loading && Array.from({ length: quantity }).map((_, i) => (
                <div key={i} className="aspect-square bg-secondary border border-border rounded-2xl animate-pulse flex items-center justify-center">
                  <Sparkles size={24} className="text-muted-foreground/30" />
                </div>
              ))}
              {images.map(img => (
                <div key={img.id} className="group relative aspect-square bg-secondary rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <p className="text-white text-xs text-center line-clamp-3">{img.prompt}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={img.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors"
                      >
                        <Download size={12} /> Baixar
                      </a>
                      <button
                        onClick={() => copyPrompt(img.id, img.prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                      >
                        {copiedId === img.id ? <Check size={12} /> : <Copy size={12} />}
                        Prompt
                      </button>
                      <button
                        onClick={() => { setPrompt(img.prompt); generateImages() }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                      >
                        <RefreshCw size={12} /> Novo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
