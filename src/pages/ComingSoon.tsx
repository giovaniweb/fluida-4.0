import { Construction } from 'lucide-react'

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-20 h-20 fluida-gradient rounded-2xl flex items-center justify-center mb-6">
        <Construction size={36} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        Esta seção está sendo construída com muito cuidado para ser 10x melhor. Em breve!
      </p>
    </div>
  )
}
