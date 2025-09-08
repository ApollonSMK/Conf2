
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, ShieldCheck, Pencil, Trash2, Loader2, Eye, CheckCircle, XCircle, Clock, Users, ArrowRight, UtensilsCrossed, BookOpen } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, DocumentData, query, where } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { getConfrariaSubmissions, updateDiscoveryStatus, getConfrariasCount } from '@/app/actions';
import Link from 'next/link';


type Discovery = {
    id: string;
    title: string;
    author: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
} & DocumentData;

async function getClientSideUsersCount(): Promise<number> {
    try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        return userSnapshot.size;
    } catch (error) {
        console.error("Error fetching users count:", error);
        return 0;
    }
}


async function getClientSideDiscoveries(): Promise<Discovery[]> {
    try {
        const discoveriesCol = collection(db, 'discoveries');
        const discoverySnapshot = await getDocs(discoveriesCol);
        const discoveryList = discoverySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discovery));
        return discoveryList;
    } catch (error) {
        console.error("Error fetching discoveries:", error);
        return [];
    }
}

async function getPendingSubmissionsCount(): Promise<number> {
    try {
        const submissionsCol = collection(db, 'confrariaSubmissions');
        const q = query(submissionsCol, where("status", "==", "Pendente"));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error("Error fetching pending submissions count:", error);
        return 0;
    }
}

export default function AdminDashboardPage() {
    const [userCount, setUserCount] = useState(0);
    const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
    const [discoveriesCount, setDiscoveriesCount] = useState(0);
    const [confrariasCount, setConfrariasCount] = useState(0);
    const [pendingSubmissions, setPendingSubmissions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [count, discoveryList, submissionsCount, totalConfrarias] = await Promise.all([
                getClientSideUsersCount(),
                getClientSideDiscoveries(),
                getPendingSubmissionsCount(),
                getConfrariasCount(),
            ]);
            setUserCount(count);
            setDiscoveries(discoveryList);
            setDiscoveriesCount(discoveryList.length)
            setPendingSubmissions(submissionsCount);
            setConfrariasCount(totalConfrarias);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateDiscoveryStatus = (discoveryId: string, status: 'Aprovado' | 'Rejeitado' | 'Pendente') => {
        startTransition(async () => {
            const result = await updateDiscoveryStatus(discoveryId, status);
            if (result.success) {
                toast({ title: 'Sucesso', description: `Descoberta marcada como ${status}.` });
                await fetchData(); // Refresh all data
            } else {
                toast({ title: 'Erro', description: result.error, variant: 'destructive' });
            }
        });
    }

  return (
      <>
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Utilizadores</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{userCount}</div> }
                       <p className="text-xs text-muted-foreground">Utilizadores registados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Descobertas</CardTitle>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{discoveriesCount}</div> }
                       <p className="text-xs text-muted-foreground">Partilhas da comunidade</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Confrarias</CardTitle>
                        <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{confrariasCount}</div> }
                       <p className="text-xs text-muted-foreground">Confrarias ativas</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos de Adesão</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{pendingSubmissions}</div> }
                       <p className="text-xs text-muted-foreground">A aguardar revisão</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-8 mt-8 lg:grid-cols-2">
                <Card className="lg:col-span-2">
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
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : discoveries.slice(0, 5).map((d: Discovery) => ( // Show only first 5
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.title}</TableCell>
                                        <TableCell>{d.author}</TableCell>
                                        <TableCell>
                                            <Badge variant={d.status === 'Aprovado' ? 'secondary' : d.status === 'Pendente' ? 'outline' : 'destructive'}>
                                                {d.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Abrir menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/explorar/${d.id}`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Aprovado')}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Aprovar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Pendente')}>
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        Pendente
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Rejeitado')} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Rejeitar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {!loading && discoveries.length > 5 && (
                            <div className="mt-4 text-center">
                                <Button asChild variant="secondary">
                                    <Link href="/painel/admin/discoveries">Ver todas as Descobertas</Link>
                                </Button>
                            </div>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  );
}
