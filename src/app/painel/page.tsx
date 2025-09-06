
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Newspaper, Settings, Stamp } from 'lucide-react';

export default function PainelPage() {
  const stats = [
    { title: 'Publicações Criadas', value: 12, icon: Newspaper },
    { title: 'Descobertas Partilhadas', value: 5, icon: BookOpen },
    { title: 'Selos Recebidos', value: 142, icon: Stamp },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Painel do Confrade</h1>
          <p className="mt-1 text-muted-foreground">Bem-vindo de volta, Confrade! Aqui está um resumo da sua atividade.</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">nos últimos 30 dias</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
            {/* Futuro conteúdo do dashboard, como gráficos ou listas de atividade recente */}
        </div>

      </div>
    </DashboardLayout>
  );
}
