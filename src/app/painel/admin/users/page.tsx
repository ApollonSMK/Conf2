
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Users as UsersIcon, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { updateUser, deleteUser } from '@/app/actions';

type User = {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: 'Admin' | 'Confrade';
    status: 'Ativo' | 'Inativo';
};


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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    // State for dialogs
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', status: '' });
    
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userList = await getClientSideUsers();
            setUsers(userList);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchUsers();
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
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <header className="mb-8">
            <div className="flex items-center gap-3">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Gerir Utilizadores</h1>
                    <p className="mt-1 text-muted-foreground">Ver, editar e gerir as contas dos utilizadores.</p>
                </div>
            </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Utilizadores</CardTitle>
                    <CardDescription>
                        {loading 
                            ? "A carregar utilizadores..." 
                            : `A mostrar ${users.length} utilizador${users.length !== 1 ? 'es' : ''}.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
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
                     { !loading && users.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">
                            Nenhum utilizador encontrado.
                        </div>
                    )}
                </CardContent>
            </Card>
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
