
'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getClientSideUsers() {
    try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => doc.data());
        return userList;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

async function getClientSideDiscoveries() {
    try {
        const discoveriesCol = collection(db, 'discoveries');
        const discoverySnapshot = await getDocs(discoveriesCol);
        const discoveryList = discoverySnapshot.docs.map(doc => doc.data());
        return discoveryList;
    } catch (error) {
        console.error("Error fetching discoveries:", error);
        return [];
    }
}

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [discoveries, setDiscoveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const userList = await getClientSideUsers();
                const discoveryList = await getClientSideDiscoveries();
                setUsers(userList);
                setDiscoveries(discoveryList);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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
                            {loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : users.map((user: any) => (
                                <TableRow key={user.email}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Ativo' ? 'secondary' : 'destructive'}>{user.status}</Badge>
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
                             {loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    </TableRow>
                                ))
                            ) : discoveries.map((d: any) => (
                                <TableRow key={d.id}>
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
