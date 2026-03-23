import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  GraduationCap, Play, Lock, CheckCircle, Clock, Star, ChevronRight,
  BookOpen, Trophy, Zap, Users, Award, BarChart2
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  locked: boolean
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  color: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  level: 'Iniciante' | 'Intermediário' | 'Avançado'
  duration: string
  students: number
  rating: number
  progress: number
  thumbnail: string
  modules: Module[]
  tags: string[]
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Marketing Digital para Estética',
    description: 'Domine as estratégias de marketing digital para clínicas e profissionais de estética. Do Instagram ao Google Ads.',
    instructor: 'Equipe Fluida',
    level: 'Iniciante',
    duration: '8h 30min',
    students: 1240,
    rating: 4.9,
    progress: 35,
    thumbnail: 'marketing',
    tags: ['Instagram', 'Conteúdo', 'Estratégia'],
    modules: [
      {
        id: 'm1',
        title: 'Fundamentos do Marketing Digital',
        description: 'Conceitos essenciais para começar',
        color: 'from-violet-500 to-purple-600',
        lessons: [
          { id: 'l1', title: 'O que é marketing digital na estética', duration: '12min', completed: true, locked: false },
          { id: 'l2', title: 'Definindo seu público-alvo', duration: '18min', completed: true, locked: false },
          { id: 'l3', title: 'Posicionamento de marca', duration: '22min', completed: false, locked: false },
          { id: 'l4', title: 'Estratégia de conteúdo 90 dias', duration: '35min', completed: false, locked: true },
        ]
      },
      {
        id: 'm2',
        title: 'Instagram para Clínicas',
        description: 'Domine o feed, stories e reels',
        color: 'from-pink-500 to-rose-600',
        lessons: [
          { id: 'l5', title: 'Configurando seu perfil profissional', duration: '15min', completed: false, locked: true },
          { id: 'l6', title: 'Criando antes/depois impactantes', duration: '28min', completed: false, locked: true },
          { id: 'l7', title: 'Estratégia de hashtags', duration: '20min', completed: false, locked: true },
          { id: 'l8', title: 'Reels que convertem', duration: '42min', completed: false, locked: true },
        ]
      },
      {
        id: 'm3',
        title: 'Conversão e Vendas',
        description: 'Transforma seguidores em pacientes',
        color: 'from-emerald-500 to-teal-600',
        lessons: [
          { id: 'l9', title: 'Funil de vendas para estética', duration: '25min', completed: false, locked: true },
          { id: 'l10', title: 'WhatsApp Business como canal', duration: '18min', completed: false, locked: true },
          { id: 'l11', title: 'Scripts de atendimento', duration: '30min', completed: false, locked: true },
        ]
      },
    ]
  },
  {
    id: '2',
    title: 'Fotografias Profissionais com Celular',
    description: 'Aprenda a tirar fotos e vídeos de qualidade profissional usando apenas o seu smartphone.',
    instructor: 'Equipe Fluida',
    level: 'Iniciante',
    duration: '4h 15min',
    students: 892,
    rating: 4.8,
    progress: 0,
    thumbnail: 'foto',
    tags: ['Fotografia', 'Celular', 'Antes/Depois'],
    modules: [
      {
        id: 'm4',
        title: 'Iluminação e Ângulos',
        description: 'O segredo das fotos perfeitas',
        color: 'from-amber-500 to-orange-600',
        lessons: [
          { id: 'l12', title: 'Luz natural vs artificial', duration: '20min', completed: false, locked: false },
          { id: 'l13', title: 'Ângulos que favorecem resultados', duration: '25min', completed: false, locked: true },
          { id: 'l14', title: 'Configurações do celular', duration: '15min', completed: false, locked: true },
        ]
      },
    ]
  },
  {
    id: '3',
    title: 'Fidelização e Gestão de Clientes',
    description: 'Estratégias avançadas para reter pacientes, aumentar o ticket médio e criar embaixadores da sua marca.',
    instructor: 'Equipe Fluida',
    level: 'Intermediário',
    duration: '6h 00min',
    students: 634,
    rating: 4.7,
    progress: 0,
    thumbnail: 'fidelizacao',
    tags: ['CRM', 'Fidelização', 'Vendas'],
    modules: [
      {
        id: 'm5',
        title: 'Base de Clientes',
        description: 'Organize e segmente sua carteira',
        color: 'from-cyan-500 to-blue-600',
        lessons: [
          { id: 'l15', title: 'Mapeando seus pacientes', duration: '22min', completed: false, locked: false },
          { id: 'l16', title: 'Sistemas de CRM simples', duration: '30min', completed: false, locked: true },
        ]
      },
    ]
  },
]

const STATS = [
  { label: 'Horas assistidas', value: '4h 20min', icon: Clock, color: 'text-violet-500' },
  { label: 'Aulas concluídas', value: '8', icon: CheckCircle, color: 'text-emerald-500' },
  { label: 'Certificados', value: '0', icon: Award, color: 'text-amber-500' },
  { label: 'Sequência', value: '3 dias', icon: Zap, color: 'text-rose-500' },
]

const LEVEL_COLOR = {
  'Iniciante': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'Intermediário': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'Avançado': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

const THUMB_GRADIENTS: Record<string, string> = {
  marketing: 'from-violet-500 to-purple-700',
  foto: 'from-amber-500 to-orange-700',
  fidelizacao: 'from-cyan-500 to-blue-700',
}

export default function Academia() {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [tab, setTab] = useState<'cursos' | 'em-andamento' | 'concluidos'>('cursos')

  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100)

  if (activeCourse && activeLesson) {
    return (
      <div className="flex flex-col h-screen bg-background animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <button
            onClick={() => { setActiveLesson(null) }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            ←
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{activeCourse.title}</p>
            <h2 className="font-semibold text-foreground">{activeLesson.title}</h2>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={12} /> {activeLesson.duration}
          </span>
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video max-h-[50vh] flex items-center justify-center">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-20', THUMB_GRADIENTS[activeCourse.thumbnail] || 'from-violet-500 to-purple-700')} />
          <div className="relative flex flex-col items-center gap-4 text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <Play size={32} className="ml-1" />
            </div>
            <p className="text-sm opacity-70">Clique para reproduzir</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-foreground mb-2">{activeLesson.title}</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Nesta aula você vai aprender conceitos fundamentais que vão transformar a forma como você se comunica com seus pacientes e prospecia clientes online.
          </p>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold text-foreground">O que você vai aprender</h3>
            {['Conceitos essenciais de marketing digital', 'Como definir seu público-alvo com precisão', 'Ferramentas gratuitas para começar hoje'].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setActiveLesson(null)}
              className="flex-1 py-3 bg-secondary border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors"
            >
              Voltar ao curso
            </button>
            <button className="flex-1 py-3 fluida-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Marcar como concluída
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (activeCourse) {
    const totalLessons = activeCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    const completedLessons = activeCourse.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)

    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <button
          onClick={() => setActiveCourse(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          ← Voltar para Academia
        </button>

        {/* Course Header */}
        <div className={cn('rounded-2xl p-8 mb-6 bg-gradient-to-br text-white', THUMB_GRADIENTS[activeCourse.thumbnail] || 'from-violet-500 to-purple-700')}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{activeCourse.level}</span>
              <h1 className="text-2xl font-bold mt-3 mb-2">{activeCourse.title}</h1>
              <p className="opacity-80 text-sm max-w-lg">{activeCourse.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1"><Clock size={14} /> {activeCourse.duration}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {activeCourse.students.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Star size={14} className="fill-current" /> {activeCourse.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{activeCourse.progress}%</div>
              <div className="text-xs opacity-70">concluído</div>
              <div className="text-sm mt-1">{completedLessons}/{totalLessons} aulas</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${activeCourse.progress}%` }} />
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {activeCourse.modules.map((module, mi) => (
            <div key={module.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className={cn('px-5 py-4 bg-gradient-to-r text-white', module.color)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-70">Módulo {mi + 1}</p>
                    <h3 className="font-bold">{module.title}</h3>
                    <p className="text-xs opacity-70 mt-0.5">{module.description}</p>
                  </div>
                  <span className="text-sm opacity-70">{module.lessons.length} aulas</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {module.lessons.map((lesson, li) => (
                  <button
                    key={lesson.id}
                    onClick={() => !lesson.locked && setActiveLesson(lesson)}
                    disabled={lesson.locked}
                    className={cn(
                      'w-full flex items-center gap-4 px-5 py-4 text-left transition-colors',
                      lesson.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      lesson.completed ? 'bg-emerald-500/20' : 'bg-secondary border border-border'
                    )}>
                      {lesson.completed
                        ? <CheckCircle size={16} className="text-emerald-500" />
                        : lesson.locked
                        ? <Lock size={14} className="text-muted-foreground" />
                        : <span className="text-xs font-bold text-muted-foreground">{li + 1}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm font-medium', lesson.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {lesson.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {lesson.duration}
                    </span>
                    {!lesson.locked && <ChevronRight size={14} className="text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="text-primary" size={24} />
          Academia Fluida
        </h1>
        <p className="text-muted-foreground mt-1">Aprenda com os melhores e domine o marketing para estética</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-secondary', stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit mb-6">
        {(['cursos', 'em-andamento', 'concluidos'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'cursos' ? 'Todos os Cursos' : t === 'em-andamento' ? 'Em Andamento' : 'Concluídos'}
          </button>
        ))}
      </div>

      {/* In progress banner */}
      {tab === 'cursos' && inProgress.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Continue de onde parou</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map(course => (
              <button
                key={course.id}
                onClick={() => setActiveCourse(course)}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all text-left group"
              >
                <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', THUMB_GRADIENTS[course.thumbnail])}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {COURSES.filter(c => {
          if (tab === 'em-andamento') return c.progress > 0 && c.progress < 100
          if (tab === 'concluidos') return c.progress === 100
          return true
        }).map(course => (
          <button
            key={course.id}
            onClick={() => setActiveCourse(course)}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all text-left group"
          >
            {/* Thumbnail */}
            <div className={cn('h-40 bg-gradient-to-br flex flex-col items-center justify-center relative', THUMB_GRADIENTS[course.thumbnail])}>
              <BookOpen size={40} className="text-white/80" />
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                  <div className="h-full bg-white" style={{ width: `${course.progress}%` }} />
                </div>
              )}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                <Star size={10} className="fill-current text-amber-400" /> {course.rating}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', LEVEL_COLOR[course.level])}>
                  {course.level}
                </span>
                {course.progress > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Em andamento
                  </span>
                )}
              </div>
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} /> {course.students.toLocaleString()}</span>
                <span className="flex items-center gap-1"><BarChart2 size={11} /> {course.modules.reduce((a, m) => a + m.lessons.length, 0)} aulas</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded-md text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {tab !== 'cursos' && COURSES.filter(c => {
        if (tab === 'em-andamento') return c.progress > 0 && c.progress < 100
        return c.progress === 100
      }).length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">{tab === 'em-andamento' ? 'Nenhum curso em andamento' : 'Nenhum curso concluído ainda'}</p>
          <p className="text-sm mt-1 opacity-70">Comece um curso para vê-lo aqui</p>
        </div>
      )}
    </div>
  )
}
