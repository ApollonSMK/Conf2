
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, ShieldCheck, Pencil, Trash2, Loader2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateUser, deleteUser, updateDiscoveryStatus } from '@/app/actions';
import Link from 'next/link';


type User = {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: 'Admin' | 'Confrade';
    status: 'Ativo' | 'Inativo';
};

type Discovery = {
    id: string;
    title: string;
    author: string;
    status: 'Aprovado' | 'Pendente' | 'Rejeitado';
} & DocumentData;


async function getClientSideUsers(): Promise<User[]> {
    try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        return userList;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
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

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    // State for dialogs
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', status: '' });
    
    const fetchUsers = async () => {
        try {
            const userList = await getClientSideUsers();
            setUsers(userList);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    
    const fetchDiscoveries = async () => {
        try {
            const discoveryList = await getClientSideDiscoveries();
            setDiscoveries(discoveryList);
        } catch (error) {
            console.error("Failed to fetch discoveries:", error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchDiscoveries()]);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setEditFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (name: string) => (value: string) => {
        setEditFormData(prev => ({...prev, [name]: value}));
    }

    const handleUpdateUser = () => {
        if (!userToEdit) return;
        startTransition(async () => {
            const result = await updateUser(userToEdit.id, editFormData);
            if (result.success) {
                toast({ title: 'Sucesso', description: 'Utilizador atualizado com sucesso.' });
                setUserToEdit(null);
                await fetchUsers(); // Refresh user list
            } else {
                toast({ title: 'Erro', description: result.error, variant: 'destructive' });
            }
        });
    };
    
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

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        startTransition(async () => {
            const result = await deleteUser(userToDelete.id);
            if (result.success) {
                toast({ title: 'Sucesso', description: 'Utilizador eliminado com sucesso.' });
                setUserToDelete(null);
                await fetchUsers(); // Refresh user list
            } else {
                toast({ title: 'Erro', description: result.error, variant: 'destructive' });
            }
        });
    };

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
                                ) : users.map((user) => (
                                    <TableRow key={user.id}>
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Abrir menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => handleEditClick(user)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setUserToDelete(user)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
                                ) : discoveries.map((d: Discovery) => (
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

        {/* Edit User Dialog */}
        <Dialog open={!!userToEdit} onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Utilizador</DialogTitle>
                    <DialogDescription>
                        Faça alterações ao perfil do utilizador aqui. Clique em guardar quando terminar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" name="name" value={editFormData.name} onChange={handleEditFormChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select name="role" value={editFormData.role} onValueChange={handleSelectChange('role')}>
                           <SelectTrigger className="col-span-3">
                               <SelectValue placeholder="Selecione um role" />
                           </SelectTrigger>
                           <SelectContent>
                               <SelectItem value="Admin">Admin</SelectItem>
                               <SelectItem value="Confrade">Confrade</SelectItem>
                           </SelectContent>
                       </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select name="status" value={editFormData.status} onValueChange={handleSelectChange('status')}>
                           <SelectTrigger className="col-span-3">
                               <SelectValue placeholder="Selecione um status" />
                           </SelectTrigger>
                           <SelectContent>
                               <SelectItem value="Ativo">Ativo</SelectItem>
                               <SelectItem value="Inativo">Inativo</SelectItem>
                           </SelectContent>
                       </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateUser} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isto irá eliminar permanentemente o
                        utilizador <span className="font-bold">{userToDelete?.name}</span> da base de dados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                         {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sim, eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
