
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, UtensilsCrossed, Eye, CheckCircle, XCircle, Clock, Loader2, Users, Pencil, Trash2 } from 'lucide-react';
import { DocumentData, Timestamp } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { getConfrariaSubmissions, updateConfrariaSubmissionStatus } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


type Submission = {
    id: string;
    confrariaName: string;
    responsibleName: string;
    email: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
    submittedAt: Date;
} & DocumentData;

type ConfrariaUser = {
    uid: string;
    name: string;
    email: string;
    status: 'Ativo' | 'Inativo';
}


function PedidosDeAdesaoTab() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const submissionList = await getConfrariaSubmissions() as Submission[];
            const sortedList = submissionList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
            setSubmissions(sortedList);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
            toast({ title: 'Erro', description: 'Não foi possível carregar as submissões.', variant: 'destructive'});
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubmissions();
    }, []);
    
    const handleUpdateStatus = (submissionId: string, status: 'Aprovado' | 'Rejeitado' | 'Pendente') => {
        startTransition(async () => {
            const result = await updateConfrariaSubmissionStatus(submissionId, status);
            if (result.success) {
                toast({ title: 'Sucesso', description: `Pedido marcado como ${status}.` });
                if (status === 'Aprovado') {
                    // TODO: Trigger user creation for the confraria
                    toast({title: 'Próximo Passo', description: 'Crie uma conta de utilizador para esta confraria na aba "Utilizadores".'})
                }
                await fetchSubmissions(); // Refresh list
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
        }).format(new Date(date));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pedidos de Adesão</CardTitle>
                <CardDescription>
                    {loading 
                        ? "A carregar pedidos..." 
                        : `A mostrar ${submissions.length} pedido${submissions.length !== 1 ? 's' : ''} de adesão.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome da Confraria</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Data do Pedido</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : submissions.map((s: Submission) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.confrariaName}</TableCell>
                                <TableCell>{s.responsibleName}<br/><span className="text-xs text-muted-foreground">{s.email}</span></TableCell>
                                <TableCell>{formatDate(s.submittedAt)}</TableCell>
                                <TableCell>
                                    <Badge variant={s.status === 'Aprovado' ? 'secondary' : s.status === 'Pendente' ? 'outline' : 'destructive'}>
                                        {s.status}
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
                                             <DropdownMenuItem disabled>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={() => handleUpdateStatus(s.id, 'Aprovado')} disabled={s.status === 'Aprovado'}>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Aprovar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleUpdateStatus(s.id, 'Pendente')} disabled={s.status === 'Pendente'}>
                                                <Clock className="mr-2 h-4 w-4" />
                                                Marcar como Pendente
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleUpdateStatus(s.id, 'Rejeitado')} disabled={s.status === 'Rejeitado'} className="text-red-600 focus:text-red-600 focus:bg-red-50">
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
                 { !loading && submissions.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        Nenhum pedido de adesão encontrado.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ConfrariasAtivasTab() {
    const [confrarias, setConfrarias] = useState<ConfrariaUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConfrarias = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "Confraria"));
            const querySnapshot = await getDocs(q);
            const confrariaList = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as ConfrariaUser));
            setConfrarias(confrariaList);
        } catch (error) {
            console.error("Failed to fetch confrarias:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfrarias();
    }, []);

    return (
         <Card>
            <CardHeader>
                <CardTitle>Confrarias Ativas</CardTitle>
                <CardDescription>
                    {loading
                        ? "A carregar confrarias..."
                        : `A mostrar ${confrarias.length} confraria${confrarias.length !== 1 ? 's' : ''} ativa${confrarias.length !== 1 ? 's' : ''}.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome da Confraria</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : confrarias.map((c) => (
                            <TableRow key={c.uid}>
                                <TableCell className="font-medium">{c.name}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>
                                    <Badge variant={c.status === 'Ativo' ? 'secondary' : 'destructive'}>{c.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!loading && confrarias.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        Nenhuma confraria ativa encontrada.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default function AdminConfrariasPage() {
  return (
        <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
            <header>
                <div className="flex items-center gap-3">
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Gerir Confrarias</h1>
                        <p className="mt-1 text-muted-foreground">Rever pedidos de adesão e gerir confrarias existentes.</p>
                    </div>
                </div>
            </header>

            <Tabs defaultValue="pedidos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pedidos">Pedidos de Adesão</TabsTrigger>
                    <TabsTrigger value="ativas">Confrarias Ativas</TabsTrigger>
                </TabsList>
                <TabsContent value="pedidos" className="mt-6">
                    <PedidosDeAdesaoTab />
                </TabsContent>
                <TabsContent value="ativas" className="mt-6">
                    <ConfrariasAtivasTab />
                </TabsContent>
            </Tabs>
        </div>
  );
}
