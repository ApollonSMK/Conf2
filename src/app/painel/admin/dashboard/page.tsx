
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, ShieldCheck, UserCheck } from 'lucide-react';

const users = [
    { name: 'Ana Costa', email: 'ana@exemplo.com', role: 'Admin', status: 'Ativo' },
    { name: 'João Pereira', email: 'joao@exemplo.com', role: 'Confrade', status: 'Ativo' },
    { name: 'Maria Silva', email: 'maria@exemplo.com', role: 'Confrade', status: 'Pendente' },
];

const discoveries = [
    { title: 'Mercearia do Zé', author: 'Maria Costa', status: 'Aprovado' },
    { title: 'Pastelaria Doce Encontro', author: 'António Silva', status: 'Pendente' },
    { title: 'Tasca do Pescador', author: 'João Pereira', status: 'Rejeitado' },
];

export default function AdminDashboardPage() {
  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Painel de Administração</h1>
                <p className="mt-1 text-muted-foreground">Gestão da plataforma, utilizadores e conteúdo.</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Gerir Utilizadores</CardTitle>
                    <CardDescription>Ver, editar e gerir as contas dos utilizadores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.email}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Ativo' ? 'outline' : 'destructive'}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                 <CardHeader>
                    <CardTitle>Gerir Descobertas</CardTitle>
                    <CardDescription>Aprovar, rejeitar ou editar as partilhas da comunidade.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Autor</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {discoveries.map(d => (
                                <TableRow key={d.title}>
                                    <TableCell className="font-medium">{d.title}</TableCell>
                                    <TableCell>{d.author}</TableCell>
                                    <TableCell>
                                        <Badge variant={d.status === 'Aprovado' ? 'secondary' : d.status === 'Pendente' ? 'outline' : 'destructive'}>
                                            {d.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
             <Card>
                 <CardHeader>
                    <CardTitle>Gerir Confrarias</CardTitle>
                    <CardDescription>Adicionar, editar ou remover confrarias da plataforma.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-md">
                        <p className="text-sm text-muted-foreground">Em construção...</p>
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
  );
}
