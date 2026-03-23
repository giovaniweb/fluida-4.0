import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Roteiros from '@/pages/Roteiros'
import ComingSoon from '@/pages/ComingSoon'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <Toaster richColors position="top-right" />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/roteiros" element={<Roteiros />} />
                <Route path="/chat" element={<ComingSoon title="FluiChat — IA Especializada" />} />
                <Route path="/imagens" element={<ComingSoon title="Geração de Imagens" />} />
                <Route path="/mkt" element={<ComingSoon title="FluiMKT — Diagnóstico" />} />
                <Route path="/academia" element={<ComingSoon title="Academia Fluida" />} />
                <Route path="/assets" element={<ComingSoon title="Biblioteca de Assets" />} />
                <Route path="/marketplace" element={<ComingSoon title="Marketplace" />} />
                <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
                <Route path="/conquistas" element={<ComingSoon title="Conquistas" />} />
                <Route path="/configuracoes" element={<ComingSoon title="Configurações" />} />
                <Route path="/admin" element={<ComingSoon title="Painel Admin" />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
