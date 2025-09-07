
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, User, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const navItems = [
  { href: '/inicio', icon: Home, label: 'Início' },
  { href: '/explorar', icon: Compass, label: 'Explorar' },
  { href: '/confrarias', icon: BookOpen, label: 'Confrarias' },
  { href: '/painel', icon: User, label: 'Painel' },
];

export function BottomNavigator() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handlePlusClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/50 bg-card/95 backdrop-blur-sm md:hidden">
        <div className="grid h-16 grid-cols-5 items-center">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/inicio' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 text-center">
                <item.icon className={cn('h-6 w-6 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <div className="flex justify-center items-center">
            <Button asChild={!!user} onClick={handlePlusClick} size="lg" className="h-14 w-14 rounded-full shadow-lg -translate-y-4">
              {user ? (
                <Link href="/explorar/nova">
                  <PlusCircle className="h-7 w-7" />
                  <span className="sr-only">Adicionar Descoberta</span>
                </Link>
              ) : (
                <span className="flex items-center justify-center">
                  <PlusCircle className="h-7 w-7" />
                  <span className="sr-only">Adicionar Descoberta</span>
                </span>
              )}
            </Button>
          </div>

          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 text-center">
                <item.icon className={cn('h-6 w-6 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

       <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>É necessário ter uma conta</AlertDialogTitle>
            <AlertDialogDescription>
              Para partilhar uma descoberta com a comunidade, precisa de iniciar sessão ou criar uma conta gratuita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <div className="flex flex-col sm:flex-row gap-2">
                <AlertDialogAction asChild className="w-full sm:w-auto">
                    <Link href="/login">Entrar</Link>
                </AlertDialogAction>
                <AlertDialogAction asChild variant="secondary" className="w-full sm:w-auto">
                    <Link href="/registo">Registar</Link>
                </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
