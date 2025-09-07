
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
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
import { PlusCircle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function AddDiscoveryButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-48 rounded-md" />;
  }

  const buttonContent = (
    <>
      <PlusCircle className="mr-2" />
      Adicionar Descoberta
    </>
  );

  return (
    <>
      {user ? (
        <Button asChild>
          <Link href="/explorar/nova">{buttonContent}</Link>
        </Button>
      ) : (
        <Button onClick={handleClick}>{buttonContent}</Button>
      )}

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
            <div className="flex gap-2">
                <AlertDialogAction asChild>
                    <Link href="/registo">Registar</Link>
                </AlertDialogAction>
                <AlertDialogAction asChild>
                    <Link href="/login">Entrar</Link>
                </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
