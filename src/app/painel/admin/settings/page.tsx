
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Definições da Plataforma</h1>
            <p className="mt-1 text-muted-foreground">Gerir as configurações globais do site.</p>
          </div>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Em Construção</CardTitle>
          <CardDescription>
            Esta área será utilizada para gerir as configurações de toda a plataforma, como integrações de API, definições de email, entre outros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">De momento, não existem configurações disponíveis para alterar. Volte em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
