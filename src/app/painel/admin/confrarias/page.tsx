
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, UtensilsCrossed, Eye, CheckCircle, XCircle, Clock, Loader2, Users, Pencil, Trash2, PlusCircle } from 'lucide-react';
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
import { getConfrariaSubmissions, updateConfrariaSubmissionStatus, createConfrariaUser } from '@/app/actions';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addOrUpdateUser } from '@/app/actions';


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


function PedidosDeAdesao() {
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
                            Array.from({ length: 3 }).map((_, index) => (
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

function ConfrariasAtivas({ refreshTrigger, onRefreshed }: { refreshTrigger: number, onRefreshed: () => void }) {
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
        if (onRefreshed) {
            onRefreshed();
        }
    }, [refreshTrigger]);

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

function AddConfrariaDialog({ onConfrariaAdded }: { onConfrariaAdded: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (password.length < 6) {
            toast({ title: 'Erro', description: 'A palavra-passe deve ter pelo menos 6 caracteres.', variant: 'destructive' });
            return;
        }

        startTransition(async () => {
            try {
                // This uses the client-side SDK. Make sure this component is only used where auth is initialized.
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                await updateProfile(user, { displayName: name });
                
                await addOrUpdateUser(user.uid, {
                    name: name,
                    email: user.email!,
                    role: 'Confraria',
                    status: 'Ativo'
                });

                toast({ title: 'Sucesso', description: 'Nova confraria adicionada com sucesso.' });
                onConfrariaAdded(); // Trigger refresh
                setOpen(false); // Close dialog
            } catch (error: any) {
                console.error("Error creating confraria user:", error);
                let description = 'Ocorreu um erro ao criar a conta da confraria.';
                if (error.code === 'auth/email-already-in-use') {
                  description = 'Este endereço de email já está a ser utilizado.';
                } else if (error.code === 'auth/weak-password') {
                  description = 'A palavra-passe é demasiado fraca. Tente uma mais forte.';
                }
                toast({ title: 'Erro', description, variant: 'destructive' });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Adicionar Confraria
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Confraria</DialogTitle>
                    <DialogDescription>
                        Crie uma nova conta de utilizador para uma confraria. Eles poderão alterar a palavra-passe mais tarde.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-confraria-form" onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Confraria</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Palavra-passe Inicial</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" form="add-confraria-form" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Adicionar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminConfrariasPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleConfrariaAdded = () => {
        setRefreshTrigger(t => t + 1);
    };

  return (
        <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Gerir Confrarias</h1>
                        <p className="mt-1 text-muted-foreground">Rever pedidos de adesão e gerir confrarias existentes.</p>
                    </div>
                </div>
                <AddConfrariaDialog onConfrariaAdded={handleConfrariaAdded} />
            </header>

            <Tabs defaultValue="ativas" className="w-full">
                <TabsList>
                    <TabsTrigger value="ativas">Confrarias Ativas</TabsTrigger>
                    <TabsTrigger value="pedidos">Pedidos de Adesão</TabsTrigger>
                </TabsList>
                <TabsContent value="ativas" className="mt-6">
                    <ConfrariasAtivas refreshTrigger={refreshTrigger} onRefreshed={() => {}} />
                </TabsContent>
                <TabsContent value="pedidos" className="mt-6">
                    <PedidosDeAdesao />
                </TabsContent>
            </Tabs>
        </div>
  );
}
