
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Home, BookOpen, Calendar, Compass, Grape, LogOut, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import '@/lib/firebase'; // Ensure Firebase is initialized

export function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Sessão terminada',
        description: 'Até à próxima!',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível terminar a sessão. Tente novamente.',
        variant: 'destructive'
      });
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Grape className="h-8 w-8" />
              <span className="font-headline font-bold text-2xl tracking-tight">
                Confrarias Portugal
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/inicio" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Home className="mr-2 h-4 w-4" /> Início
            </Link>
            <Link href="/explorar" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Compass className="mr-2 h-4 w-4" /> Descobertas
            </Link>
            <Link href="/confrarias" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <BookOpen className="mr-2 h-4 w-4" /> Confrarias
            </Link>
            <Link href="/eventos" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Calendar className="mr-2 h-4 w-4" /> Eventos
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-9 w-24 rounded-md bg-secondary/80 animate-pulse" />
            ) : user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'Avatar do Utilizador'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/painel">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Painel</span>
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem disabled>
                     <User className="mr-2 h-4 w-4" />
                     <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Terminar Sessão</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="secondary" size="sm">
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
