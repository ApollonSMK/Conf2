
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, BookOpen, Eye, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, DocumentData, Timestamp } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { updateDiscoveryStatus } from '@/app/actions';
import Link from 'next/link';

type Discovery = {
    id: string;
    title: string;
    author: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
    createdAt: Date;
} & DocumentData;

async function getClientSideDiscoveries(): Promise<Discovery[]> {
    try {
        const discoveriesCol = collection(db, 'discoveries');
        const discoverySnapshot = await getDocs(discoveriesCol);
        const discoveryList = discoverySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
            } as Discovery
        });
        // Sort by most recent first
        return discoveryList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
        console.error("Error fetching discoveries:", error);
        return [];
    }
}

export default function AdminDiscoveriesPage() {
    const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const fetchDiscoveries = async () => {
        setLoading(true);
        try {
            const discoveryList = await getClientSideDiscoveries();
            setDiscoveries(discoveryList);
        } catch (error) {
            console.error("Failed to fetch discoveries:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDiscoveries();
    }, []);
    
    const handleUpdateDiscoveryStatus = (discoveryId: string, status: 'Aprovado' | 'Rejeitado' | 'Pendente') => {
        startTransition(async () => {
            const result = await updateDiscoveryStatus(discoveryId, status);
            if (result.success) {
                toast({ title: 'Sucesso', description: `Descoberta marcada como ${status}.` });
                await fetchDiscoveries(); // Refresh discovery list
            } else {
                toast({ title: 'Erro', description: result.error, variant: 'destructive' });
            }
        });
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

  return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <header className="mb-8">
            <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Gerir Descobertas</h1>
                    <p className="mt-1 text-muted-foreground">Aprovar, rejeitar ou editar as partilhas da comunidade.</p>
                </div>
            </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Descobertas</CardTitle>
                    <CardDescription>
                        {loading 
                            ? "A carregar descobertas..." 
                            : `A mostrar ${discoveries.length} descoberta${discoveries.length !== 1 ? 's' : ''}.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Autor</TableHead>
                                <TableHead>Data de Submissão</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : discoveries.map((d: Discovery) => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{d.title}</TableCell>
                                    <TableCell>{d.author}</TableCell>
                                    <TableCell>{formatDate(d.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={d.status === 'Aprovado' ? 'secondary' : d.status === 'Pendente' ? 'outline' : 'destructive'}>
                                            {d.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={isPending}>
                                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> :<MoreHorizontal className="h-4 w-4" />}
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
                                                <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Aprovado')} disabled={d.status === 'Aprovado'}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Aprovar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Pendente')} disabled={d.status === 'Pendente'}>
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    Marcar como Pendente
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => handleUpdateDiscoveryStatus(d.id, 'Rejeitado')} disabled={d.status === 'Rejeitado'} className="text-red-600 focus:text-red-600 focus:bg-red-50">
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
                     { !loading && discoveries.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">
                            Nenhuma descoberta encontrada.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
  );
}
