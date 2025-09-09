
'use client';

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MessageSquare, ThumbsUp, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useState, useEffect, useTransition } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getUserProfile, deletePost } from '@/app/actions';
import { NewPostForm } from './new-post-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Post {
    id: string;
    confrariaId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likes?: number;
    comments?: number;
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();

    const auth = getAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const profile = await getUserProfile(currentUser.uid);
                setUserRole(profile?.role || null);
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [auth]);

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deletePost(post.id);
            if (result.success) {
                toast({ title: 'Sucesso', description: 'Publicação eliminada.'});
                setIsDeleteAlertOpen(false);
                router.refresh();
            } else {
                toast({ title: 'Erro', description: result.error, variant: 'destructive'});
            }
        });
    }
    
    const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: pt }) : '';

    const canEdit = !loadingAuth && user && (user.uid === post.authorId || userRole === 'Admin');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar>
                    <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                    <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-foreground">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">{timeAgo}</p>
                </div>
                
                {canEdit && (
                     <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-auto">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                     <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                     <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar
                                        </DropdownMenuItem>
                                     </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. A publicação será eliminada permanentemente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sim, eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>

                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Editar Publicação</DialogTitle>
                            </DialogHeader>
                            <NewPostForm 
                                confrariaId={post.confrariaId} 
                                post={post} 
                                onPostUpdated={() => setIsEditModalOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <CardTitle className="text-xl text-primary">{post.title}</CardTitle>
                <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                 {post.imageUrl && (
                    <div className="relative aspect-video w-full mt-4 rounded-lg overflow-hidden border">
                       <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                 <Button variant="ghost">
                    <ThumbsUp className="mr-2"/>
                    Gosto ({post.likes || 0})
                </Button>
                <Button variant="ghost">
                     <MessageSquare className="mr-2"/>
                    Comentar ({post.comments || 0})
                </Button>
            </CardFooter>
        </Card>
    );
}
