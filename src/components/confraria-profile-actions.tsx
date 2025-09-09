
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

interface ConfrariaProfileActionsProps {
  confrariaId: string;
}

export function ConfrariaProfileActions({ confrariaId }: ConfrariaProfileActionsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <Skeleton className="h-10 w-28" />;
  }

  const isOwner = user?.uid === confrariaId;
  const isAdmin = userRole === 'Admin';
  
  if (!isOwner && !isAdmin) {
    return null;
  }
  
  // For admins, the link goes to the admin edit page.
  // For owners, it could go to a user-facing settings page.
  // For simplicity here, we'll point both to the more powerful admin edit page,
  // assuming owners might be granted similar editing rights in their own dashboard later.
  // A more robust solution might have a separate /painel/perfil/editar page.
  const editLink = `/painel/admin/confrarias/editar/${confrariaId}`;

  return (
    <Button asChild>
      <Link href={editLink}>
        <Pencil className="mr-2" />
        Editar Perfil
      </Link>
    </Button>
  );
}
